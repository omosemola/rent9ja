import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getLandlordAnalytics(landlordId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalViews, totalSaved, totalAppointments, totalChats, properties, recentViews, profileViews] = await Promise.all([
      this.prisma.propertyView.count({
        where: { property: { landlordId } },
      }),
      this.prisma.favorite.count({
        where: { property: { landlordId } },
      }),
      this.prisma.appointment.count({
        where: { landlordId },
      }),
      this.prisma.conversationParticipant.count({
        where: { userId: landlordId },
      }),
      this.prisma.property.findMany({
        where: { landlordId },
        select: {
          id: true, title: true, status: true, viewCount: true, savedCount: true,
          _count: { select: { appointments: true } },
        },
      }),
      this.prisma.propertyView.count({
        where: { property: { landlordId }, createdAt: { gte: thirtyDaysAgo } },
      }),
      0, // Placeholder for profile views
    ]);

    // Calculate conversion rate
    const conversionRate = totalViews > 0 ? ((totalAppointments / totalViews) * 100).toFixed(1) : '0';

    return {
      overview: {
        totalViews,
        totalSaved,
        totalAppointments,
        totalChats,
        conversionRate: `${conversionRate}%`,
        recentViews,
        profileViews,
      },
      properties,
    };
  }
}
