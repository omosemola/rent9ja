import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaymentProvider, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async initializePaystack(userId: string, amount: number, subscriptionId: string, email: string) {
    // TODO: Integrate with Paystack API
    // const response = await fetch('https://api.paystack.co/transaction/initialize', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ amount: amount * 100, email, currency: 'NGN' }),
    // });

    const reference = `PSK_${Date.now()}_${userId.slice(0, 8)}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        subscriptionId,
        amount,
        provider: PaymentProvider.PAYSTACK,
        providerRef: reference,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      payment,
      authorizationUrl: `https://checkout.paystack.com/${reference}`, // Placeholder
      reference,
    };
  }

  async initializeFlutterwave(userId: string, amount: number, subscriptionId: string, email: string) {
    const reference = `FLW_${Date.now()}_${userId.slice(0, 8)}`;

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        subscriptionId,
        amount,
        provider: PaymentProvider.FLUTTERWAVE,
        providerRef: reference,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      payment,
      paymentLink: `https://checkout.flutterwave.com/v3/hosted/pay/${reference}`, // Placeholder
      reference,
    };
  }

  async verifyPayment(reference: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { providerRef: reference },
    });

    if (!payment) return null;

    // TODO: Verify with payment provider API
    // For now, mark as successful
    const updated = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.SUCCESS, paidAt: new Date() },
    });

    // Activate subscription if payment is for a subscription
    if (payment.subscriptionId) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await this.prisma.subscription.update({
        where: { id: payment.subscriptionId },
        data: { plan: 'PREMIUM', status: 'ACTIVE', endDate },
      });
    }

    return updated;
  }

  async getPaymentHistory(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.payment.count({ where: { userId } }),
    ]);

    return { data: payments, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
