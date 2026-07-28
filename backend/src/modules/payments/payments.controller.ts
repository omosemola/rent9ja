import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post('paystack/initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Initialize Paystack payment' })
  async initializePaystack(@Req() req: any, @Body() body: { amount: number; subscriptionId: string }) {
    return this.service.initializePaystack(req.user.id, body.amount, body.subscriptionId, req.user.email);
  }

  @Post('flutterwave/initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Initialize Flutterwave payment' })
  async initializeFlutterwave(@Req() req: any, @Body() body: { amount: number; subscriptionId: string }) {
    return this.service.initializeFlutterwave(req.user.id, body.amount, body.subscriptionId, req.user.email);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify payment (webhook)' })
  async verifyPayment(@Body('reference') reference: string) {
    return this.service.verifyPayment(reference);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get payment history' })
  async getHistory(@Req() req: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.getPaymentHistory(req.user.id, page, limit);
  }
}
