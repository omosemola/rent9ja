import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('LANDLORD' as any)
@ApiBearerAuth('JWT-auth')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('landlord')
  @ApiOperation({ summary: 'Get landlord analytics dashboard data' })
  async getLandlordAnalytics(@Req() req: any) {
    return this.service.getLandlordAnalytics(req.user.id);
  }
}
