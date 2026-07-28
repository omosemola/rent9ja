import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentStatus } from '@prisma/client';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AppointmentsController {
  constructor(private readonly service: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Book an inspection appointment' })
  async create(@Req() req: any, @Body() body: {
    propertyId: string;
    scheduledDate: string;
    scheduledTime: string;
    meetingLocation?: string;
    notes?: string;
  }) {
    return this.service.create(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get user appointments' })
  async getMyAppointments(@Req() req: any) {
    return this.service.getByUser(req.user.id, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details' })
  async getById(@Param('id') id: string, @Req() req: any) {
    return this.service.getById(id, req.user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update appointment status (accept, reject, reschedule, etc.)' })
  async updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() body: {
      status: AppointmentStatus;
      rejectionReason?: string;
      suggestedDate?: string;
      suggestedTime?: string;
    },
  ) {
    return this.service.updateStatus(id, req.user.id, body.status, body);
  }
}
