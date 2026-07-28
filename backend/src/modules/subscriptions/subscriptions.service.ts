import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return [
      {
        plan: 'FREE',
        name: 'Basic',
        price: 0,
        features: [
          'Up to 3 property listings',
          'Basic analytics',
          'Standard support',
          'Limited chat messages',
        ],
      },
      {
        plan: 'PREMIUM',
        name: 'Premium',
        price: 15000, // NGN
        period: 'monthly',
        features: [
          'Unlimited property listings',
          'Featured listings',
          'Priority search ranking',
          'Verified badge',
          'Advanced analytics',
          'Higher visibility',
          'Unlimited chats',
          'Premium support',
        ],
      },
    ];
  }

  async getCurrentSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isPremium(userId: string): Promise<boolean> {
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, plan: 'PREMIUM', status: 'ACTIVE', endDate: { gte: new Date() } },
    });
    return !!sub;
  }
}
