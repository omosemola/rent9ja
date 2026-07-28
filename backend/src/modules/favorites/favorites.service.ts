import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, propertyId: string, collectionName?: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      await this.prisma.property.update({
        where: { id: propertyId },
        data: { savedCount: { decrement: 1 } },
      });
      return { isFavorited: false };
    }

    await this.prisma.favorite.create({
      data: { userId, propertyId, collectionName: collectionName || 'Saved' },
    });
    await this.prisma.property.update({
      where: { id: propertyId },
      data: { savedCount: { increment: 1 } },
    });
    return { isFavorited: true };
  }

  async getAll(userId: string, collectionName?: string) {
    const where: any = { userId };
    if (collectionName) where.collectionName = collectionName;

    return this.prisma.favorite.findMany({
      where,
      include: {
        property: {
          include: {
            media: { orderBy: { order: 'asc' }, take: 1 },
            landlord: {
              select: { id: true, fullName: true, landlordProfile: { select: { isVerified: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCollections(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { collectionName: true },
      distinct: ['collectionName'],
    });

    const collections = await Promise.all(
      favorites.map(async (f) => {
        const count = await this.prisma.favorite.count({
          where: { userId, collectionName: f.collectionName },
        });
        return { name: f.collectionName, count };
      }),
    );

    return collections;
  }
}
