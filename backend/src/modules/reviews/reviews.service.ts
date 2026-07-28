import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, data: {
    landlordId: string;
    propertyId?: string;
    communication: number;
    professionalism: number;
    accuracy: number;
    overall: number;
    comment?: string;
    photos?: string[];
  }) {
    const review = await this.prisma.review.create({
      data: { reviewerId, ...data },
      include: {
        reviewer: { select: { id: true, fullName: true, profilePicture: true } },
      },
    });

    // Update landlord's average rating
    const stats = await this.prisma.review.aggregate({
      where: { landlordId: data.landlordId },
      _avg: { overall: true },
      _count: true,
    });

    await this.prisma.landlordProfile.updateMany({
      where: { userId: data.landlordId },
      data: {
        averageRating: stats._avg.overall || 0,
        totalReviews: stats._count,
      },
    });

    return review;
  }

  async getByLandlord(landlordId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { landlordId, isApproved: true },
        include: {
          reviewer: { select: { id: true, fullName: true, profilePicture: true } },
          property: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { landlordId, isApproved: true } }),
    ]);

    return { data: reviews, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async delete(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.reviewerId !== userId) throw new ForbiddenException('Not authorized');

    await this.prisma.review.delete({ where: { id: reviewId } });
    return { message: 'Review deleted' };
  }
}
