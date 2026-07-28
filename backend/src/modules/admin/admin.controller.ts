import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  async getDashboard() {
    return this.service.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (paginated)' })
  async getUsers(@Query('role') role?: UserRole, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.getUsers(role, page, limit);
  }

  @Patch('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend a user' })
  async suspendUser(@Param('id') id: string) {
    return this.service.suspendUser(id);
  }

  @Patch('users/:id/activate')
  @ApiOperation({ summary: 'Activate a suspended user' })
  async activateUser(@Param('id') id: string) {
    return this.service.activateUser(id);
  }

  @Get('listings/pending')
  @ApiOperation({ summary: 'Get pending listings for review' })
  async getPendingListings(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.getPendingListings(page, limit);
  }

  @Patch('listings/:id/approve')
  @ApiOperation({ summary: 'Approve a listing' })
  async approveListing(@Param('id') id: string) {
    return this.service.approveListing(id);
  }

  @Patch('listings/:id/reject')
  @ApiOperation({ summary: 'Reject a listing' })
  async rejectListing(@Param('id') id: string) {
    return this.service.rejectListing(id);
  }

  @Patch('listings/:id/feature')
  @ApiOperation({ summary: 'Toggle featured status' })
  async featureListing(@Param('id') id: string, @Query('featured') featured: boolean) {
    return this.service.featureListing(id, featured);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get user/listing reports' })
  async getReports(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.getReports(page, limit);
  }
}
