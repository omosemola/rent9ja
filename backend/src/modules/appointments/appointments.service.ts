// ============================================================================
// Appointments Service
// ============================================================================

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(hunterId: string, data: {
    propertyId: string;
    scheduledDate: string;
    scheduledTime: string;
    meetingLocation?: string;
    notes?: string;
  }) {
    const property = await this.prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property) throw new NotFoundException('Property not found');

    return this.prisma.appointment.create({
      data: {
        ...data,
        hunterId,
        landlordId: property.landlordId,
        scheduledDate: new Date(data.scheduledDate),
      },
      include: {
        property: { select: { id: true, title: true, address: true } },
        hunter: { select: { id: true, fullName: true, profilePicture: true, phone: true } },
        landlord: { select: { id: true, fullName: true, profilePicture: true, phone: true } },
      },
    });
  }

  async updateStatus(appointmentId: string, userId: string, status: AppointmentStatus, extra?: {
    rejectionReason?: string;
    suggestedDate?: string;
    suggestedTime?: string;
  }) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.landlordId !== userId && appointment.hunterId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        rejectionReason: extra?.rejectionReason,
        suggestedDate: extra?.suggestedDate ? new Date(extra.suggestedDate) : undefined,
        suggestedTime: extra?.suggestedTime,
        completedAt: status === AppointmentStatus.COMPLETED ? new Date() : undefined,
        cancelledAt: status === AppointmentStatus.CANCELLED ? new Date() : undefined,
      },
      include: {
        property: { select: { id: true, title: true, address: true } },
        hunter: { select: { id: true, fullName: true, phone: true } },
        landlord: { select: { id: true, fullName: true, phone: true } },
      },
    });
  }

  async getByUser(userId: string, role: string) {
    const where = role === 'LANDLORD'
      ? { landlordId: userId }
      : { hunterId: userId };

    return this.prisma.appointment.findMany({
      where,
      include: {
        property: { select: { id: true, title: true, address: true, media: { take: 1 } } },
        hunter: { select: { id: true, fullName: true, profilePicture: true, phone: true } },
        landlord: { select: { id: true, fullName: true, profilePicture: true, phone: true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async getById(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        property: { include: { media: { take: 3 } } },
        hunter: { select: { id: true, fullName: true, profilePicture: true, phone: true, email: true } },
        landlord: { select: { id: true, fullName: true, profilePicture: true, phone: true, email: true } },
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.landlordId !== userId && appointment.hunterId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return appointment;
  }
}
