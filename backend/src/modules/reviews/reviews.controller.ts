import { Controller, Get, Post, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit a review for a landlord' })
  async create(@Req() req: any, @Body() body: {
    landlordId: string; propertyId?: string;
    communication: number; professionalism: number;
    accuracy: number; overall: number;
    comment?: string; photos?: string[];
  }) {
    return this.service.create(req.user.id, body);
  }

  @Get('landlord/:id')
  @ApiOperation({ summary: 'Get reviews for a landlord' })
  async getByLandlord(@Param('id') id: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.getByLandlord(id, page, limit);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete own review' })
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.service.delete(id, req.user.id);
  }
}
