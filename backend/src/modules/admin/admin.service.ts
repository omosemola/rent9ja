import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PropertyStatus, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalUsers, totalLandlords, totalHunters, totalProperties, activeListings, pendingReview, totalAppointments, totalReviews] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.LANDLORD } }),
      this.prisma.user.count({ where: { role: UserRole.HUNTER } }),
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: PropertyStatus.ACTIVE } }),
      this.prisma.property.count({ where: { status: PropertyStatus.PENDING_REVIEW } }),
      this.prisma.appointment.count(),
      this.prisma.review.count(),
    ]);

    return { totalUsers, totalLandlords, totalHunters, totalProperties, activeListings, pendingReview, totalAppointments, totalReviews };
  }

  async getUsers(role?: UserRole, page: number = 1, limit: number = 20) {
    const where: any = {};
    if (role) where.role = role;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: { id: true, email: true, phone: true, fullName: true, role: true, isActive: true, isEmailVerified: true, createdAt: true, _count: { select: { properties: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data: users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async suspendUser(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { isActive: false } });
  }

  async activateUser(userId: string) {
    return this.prisma.user.update({ where: { id: userId }, data: { isActive: true } });
  }

  async getPendingListings(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [properties, total] = await Promise.all([
      this.prisma.property.findMany({
        where: { status: PropertyStatus.PENDING_REVIEW },
        include: {
          media: { take: 3 },
          landlord: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.property.count({ where: { status: PropertyStatus.PENDING_REVIEW } }),
    ]);

    return { data: properties, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async approveListing(propertyId: string) {
    return this.prisma.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.ACTIVE, publishedAt: new Date() },
    });
  }

  async rejectListing(propertyId: string) {
    return this.prisma.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.REJECTED },
    });
  }

  async featureListing(propertyId: string, isFeatured: boolean) {
    return this.prisma.property.update({
      where: { id: propertyId },
      data: { isFeatured },
    });
  }

  async getReports(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        include: {
          reporter: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count(),
    ]);

    return { data: reports, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
