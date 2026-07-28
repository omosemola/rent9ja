// ============================================================================
// Properties Controller
// ============================================================================

import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, Req, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchPropertyDto } from './dto/search-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PropertyStatus } from '@prisma/client';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD' as any)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new property listing' })
  async create(@Req() req: any, @Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(req.user.id, dto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search properties with filters' })
  async search(@Query() dto: SearchPropertyDto) {
    return this.propertiesService.search(dto);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured properties' })
  async getFeatured(@Query('limit') limit?: number) {
    return this.propertiesService.getFeatured(limit);
  }

  @Get('newest')
  @ApiOperation({ summary: 'Get newest listings' })
  async getNewest(@Query('limit') limit?: number) {
    return this.propertiesService.getNewest(limit);
  }

  @Get('my-listings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD' as any)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get landlord\'s own properties' })
  async getMyListings(@Req() req: any, @Query('status') status?: PropertyStatus) {
    return this.propertiesService.getByLandlord(req.user.id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property details' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id;
    return this.propertiesService.findOne(id, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD' as any)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a property' })
  async update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdatePropertyDto) {
    return this.propertiesService.update(id, req.user.id, dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD' as any)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change property status (publish, pause, mark rented)' })
  async updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body('status') status: PropertyStatus,
  ) {
    return this.propertiesService.updateStatus(id, req.user.id, status);
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD' as any)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Duplicate a property listing' })
  async duplicate(@Param('id') id: string, @Req() req: any) {
    return this.propertiesService.duplicate(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LANDLORD' as any)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a property' })
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.propertiesService.delete(id, req.user.id);
  }
}
