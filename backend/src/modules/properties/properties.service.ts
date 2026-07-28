// ============================================================================
// Properties Service - Property CRUD, Search, Filtering
// ============================================================================

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
import { PropertyStatus, Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Create a new property listing
   */
  async create(landlordId: string, dto: CreatePropertyDto) {
    const totalMoveInCost =
      (dto.rentAmount || 0) +
      (dto.serviceCharge || 0) +
      (dto.agencyFee || 0) +
      (dto.legalFee || 0) +
      (dto.cautionFee || 0) +
      (dto.agreementFee || 0);

    const property = await this.prisma.property.create({
      data: {
        ...dto,
        landlordId,
        totalMoveInCost,
        status: dto.status || PropertyStatus.DRAFT,
      },
      include: {
        media: true,
        landlord: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
            phone: true,
            landlordProfile: true,
          },
        },
      },
    });

    // Update landlord's active listings count
    await this.updateLandlordListingCount(landlordId);

    return property;
  }

  /**
   * Update a property
   */
  async update(propertyId: string, landlordId: string, dto: UpdatePropertyDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.landlordId !== landlordId) {
      throw new ForbiddenException('You can only edit your own properties');
    }

    const totalMoveInCost =
      (dto.rentAmount ?? property.rentAmount) +
      (dto.serviceCharge ?? property.serviceCharge ?? 0) +
      (dto.agencyFee ?? property.agencyFee ?? 0) +
      (dto.legalFee ?? property.legalFee ?? 0) +
      (dto.cautionFee ?? property.cautionFee ?? 0) +
      (dto.agreementFee ?? property.agreementFee ?? 0);

    return this.prisma.property.update({
      where: { id: propertyId },
      data: {
        ...dto,
        totalMoveInCost,
      },
      include: {
        media: { orderBy: { order: 'asc' } },
        landlord: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
            phone: true,
            landlordProfile: true,
          },
        },
      },
    });
  }

  /**
   * Delete a property
   */
  async delete(propertyId: string, landlordId: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.landlordId !== landlordId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await this.prisma.property.delete({ where: { id: propertyId } });
    await this.updateLandlordListingCount(landlordId);

    return { message: 'Property deleted successfully' };
  }

  /**
   * Get property by ID with full details
   */
  async findOne(propertyId: string, userId?: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        media: { orderBy: { order: 'asc' } },
        landlord: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
            phone: true,
            email: true,
            landlordProfile: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: { id: true, fullName: true, profilePicture: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { favorites: true, reviews: true, appointments: true },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Track view
    await this.prisma.propertyView.create({
      data: {
        propertyId,
        userId: userId || null,
      },
    });

    // Increment view count
    await this.prisma.property.update({
      where: { id: propertyId },
      data: { viewCount: { increment: 1 } },
    });

    // Check if user has favorited this property
    let isFavorited = false;
    if (userId) {
      const favorite = await this.prisma.favorite.findUnique({
        where: {
          userId_propertyId: { userId, propertyId },
        },
      });
      isFavorited = !!favorite;
    }

    return { ...property, isFavorited };
  }

  /**
   * Search and filter properties
   */
  async search(dto: SearchPropertyDto) {
    const {
      query,
      state,
      city,
      area,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      isFurnished,
      petsAllowed,
      hasParking,
      hasSecurity,
      hasElectricity,
      hasWaterSupply,
      sortBy,
      page = 1,
      limit = 20,
    } = dto;

    const where: Prisma.PropertyWhereInput = {
      status: PropertyStatus.ACTIVE,
    };

    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { area: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Location filters
    if (state) where.state = { equals: state, mode: 'insensitive' };
    if (city) where.lga = { equals: city, mode: 'insensitive' };
    if (area) where.area = { contains: area, mode: 'insensitive' };

    // Property type
    if (propertyType) where.propertyType = propertyType;

    // Price range
    if (minPrice || maxPrice) {
      where.rentAmount = {};
      if (minPrice) where.rentAmount.gte = minPrice;
      if (maxPrice) where.rentAmount.lte = maxPrice;
    }

    // Room filters
    if (bedrooms) where.bedrooms = { gte: bedrooms };
    if (bathrooms) where.bathrooms = { gte: bathrooms };

    // Boolean filters
    if (isFurnished !== undefined) where.isFurnished = isFurnished;
    if (petsAllowed !== undefined) where.petsAllowed = petsAllowed;
    if (hasParking !== undefined) where.hasParking = hasParking;
    if (hasSecurity !== undefined) where.hasSecurity = hasSecurity;
    if (hasElectricity !== undefined) where.hasElectricity = hasElectricity;
    if (hasWaterSupply !== undefined) where.hasWaterSupply = hasWaterSupply;

    // Sorting
    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'price_low':
        orderBy = { rentAmount: 'asc' };
        break;
      case 'price_high':
        orderBy = { rentAmount: 'desc' };
        break;
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
    }

    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          media: { orderBy: { order: 'asc' }, take: 3 },
          landlord: {
            select: {
              id: true,
              fullName: true,
              profilePicture: true,
              landlordProfile: {
                select: { isVerified: true, verificationBadge: true },
              },
            },
          },
          _count: { select: { favorites: true } },
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Get featured properties for the home screen
   */
  async getFeatured(limit: number = 10) {
    return this.prisma.property.findMany({
      where: { status: PropertyStatus.ACTIVE, isFeatured: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        media: { orderBy: { order: 'asc' }, take: 1 },
        landlord: {
          select: {
            id: true,
            fullName: true,
            profilePicture: true,
            landlordProfile: { select: { isVerified: true } },
          },
        },
      },
    });
  }

  /**
   * Get newest listings
   */
  async getNewest(limit: number = 10) {
    return this.prisma.property.findMany({
      where: { status: PropertyStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        media: { orderBy: { order: 'asc' }, take: 1 },
        landlord: {
          select: {
            id: true,
            fullName: true,
            landlordProfile: { select: { isVerified: true } },
          },
        },
      },
    });
  }

  /**
   * Get properties by landlord
   */
  async getByLandlord(landlordId: string, status?: PropertyStatus) {
    const where: Prisma.PropertyWhereInput = { landlordId };
    if (status) where.status = status;

    return this.prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        media: { orderBy: { order: 'asc' }, take: 1 },
        _count: {
          select: { favorites: true, views: true, appointments: true },
        },
      },
    });
  }

  /**
   * Change property status
   */
  async updateStatus(propertyId: string, landlordId: string, status: PropertyStatus) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) throw new NotFoundException('Property not found');
    if (property.landlordId !== landlordId) {
      throw new ForbiddenException('Not authorized');
    }

    const updatedProperty = await this.prisma.property.update({
      where: { id: propertyId },
      data: {
        status,
        publishedAt: status === PropertyStatus.ACTIVE ? new Date() : property.publishedAt,
      },
    });

    await this.updateLandlordListingCount(landlordId);

    return updatedProperty;
  }

  /**
   * Duplicate a property listing
   */
  async duplicate(propertyId: string, landlordId: string) {
    const original = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: { media: true },
    });

    if (!original) throw new NotFoundException('Property not found');
    if (original.landlordId !== landlordId) {
      throw new ForbiddenException('Not authorized');
    }

    const { id, createdAt, updatedAt, publishedAt, viewCount, savedCount, ...data } = original;

    const duplicate = await this.prisma.property.create({
      data: {
        ...data,
        title: `${data.title} (Copy)`,
        status: PropertyStatus.DRAFT,
        media: {
          create: original.media.map(({ id, propertyId, createdAt, ...m }) => m),
        },
      },
      include: { media: true },
    });

    return duplicate;
  }

  // ── Private Helpers ──────────────────────────────────────────────────

  private async updateLandlordListingCount(landlordId: string) {
    const count = await this.prisma.property.count({
      where: { landlordId, status: PropertyStatus.ACTIVE },
    });

    await this.prisma.landlordProfile.updateMany({
      where: { userId: landlordId },
      data: { totalActiveListings: count },
    });
  }
}
