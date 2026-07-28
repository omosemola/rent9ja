import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async uploadPropertyMedia(propertyId: string, file: Express.Multer.File, type: MediaType = MediaType.IMAGE) {
    // TODO: Upload to Cloudinary
    // const result = await cloudinary.uploader.upload(file.path, {
    //   folder: 'rentnaija/properties',
    //   transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
    // });

    const lastMedia = await this.prisma.propertyMedia.findFirst({
      where: { propertyId },
      orderBy: { order: 'desc' },
    });

    const media = await this.prisma.propertyMedia.create({
      data: {
        propertyId,
        url: `/uploads/${file.filename}`, // Placeholder - would be Cloudinary URL
        publicId: file.filename,
        type,
        order: (lastMedia?.order || 0) + 1,
        size: file.size,
        isOptimized: true,
      },
    });

    return media;
  }

  async deletePropertyMedia(mediaId: string) {
    const media = await this.prisma.propertyMedia.findUnique({ where: { id: mediaId } });
    if (!media) return;

    // TODO: Delete from Cloudinary
    // await cloudinary.uploader.destroy(media.publicId);

    await this.prisma.propertyMedia.delete({ where: { id: mediaId } });
    return { message: 'Media deleted' };
  }

  async reorderMedia(propertyId: string, mediaIds: string[]) {
    const updates = mediaIds.map((id, index) =>
      this.prisma.propertyMedia.update({
        where: { id },
        data: { order: index },
      }),
    );

    await Promise.all(updates);
    return { message: 'Media reordered' };
  }
}
