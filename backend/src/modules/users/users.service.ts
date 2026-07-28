// ============================================================================
// Users Service - Profile Management
// ============================================================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateLandlordProfileDto } from './dto/update-landlord-profile.dto';
import { UpdateHunterProfileDto } from './dto/update-hunter-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        landlordProfile: true,
        hunterProfile: true,
        _count: {
          select: {
            properties: true,
            reviewsReceived: true,
            favorites: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { passwordHash, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, data: { fullName?: string; profilePicture?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, email: true, phone: true, fullName: true,
        profilePicture: true, role: true, isEmailVerified: true,
        isPhoneVerified: true, createdAt: true,
      },
    });
  }

  async updateLandlordProfile(userId: string, dto: UpdateLandlordProfileDto) {
    await this.prisma.landlordProfile.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });

    return this.getProfile(userId);
  }

  async updateHunterProfile(userId: string, dto: UpdateHunterProfileDto) {
    await this.prisma.hunterProfile.upsert({
      where: { userId },
      update: dto,
      create: { userId, ...dto },
    });

    return this.getProfile(userId);
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        profilePicture: true,
        role: true,
        createdAt: true,
        landlordProfile: true,
        _count: {
          select: { properties: true, reviewsReceived: true },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getLandlordReviews(landlordId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { landlordId },
        include: {
          reviewer: {
            select: { id: true, fullName: true, profilePicture: true },
          },
          property: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { landlordId } }),
    ]);

    return {
      data: reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { fcmToken },
    });
  }
}
