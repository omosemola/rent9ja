import { Controller, Get, Post, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FavoritesController {
  constructor(private readonly service: FavoritesService) {}

  @Post(':propertyId')
  @ApiOperation({ summary: 'Toggle favorite on a property' })
  async toggle(@Param('propertyId') propertyId: string, @Req() req: any, @Body('collectionName') collectionName?: string) {
    return this.service.toggle(req.user.id, propertyId, collectionName);
  }

  @Get()
  @ApiOperation({ summary: 'Get all favorited properties' })
  async getAll(@Req() req: any, @Query('collection') collection?: string) {
    return this.service.getAll(req.user.id, collection);
  }

  @Get('collections')
  @ApiOperation({ summary: 'Get favorite collections' })
  async getCollections(@Req() req: any) {
    return this.service.getCollections(req.user.id);
  }
}
