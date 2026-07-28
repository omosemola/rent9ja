// ============================================================================
// OTP Service - Email & Phone Verification
// ============================================================================

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate a random OTP code
   */
  private generateCode(length: number = 6): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }

  /**
   * Send email OTP
   */
  async sendEmailOtp(userId: string, email: string, type: string = 'email'): Promise<void> {
    const code = this.generateCode();
    const expiryMinutes = this.configService.get('OTP_EXPIRY_MINUTES', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Invalidate previous OTPs
    await this.prisma.otpCode.updateMany({
      where: { userId, type, isUsed: false },
      data: { isUsed: true },
    });

    // Create new OTP
    await this.prisma.otpCode.create({
      data: {
        userId,
        code,
        type,
        expiresAt,
      },
    });

    // TODO: Send email via SMTP (nodemailer)
    // In development, log the code
    this.logger.log(`[DEV] OTP for ${email}: ${code}`);

    // Production email sending would go here:
    // await this.emailService.send({
    //   to: email,
    //   subject: 'Your RentNaija Verification Code',
    //   template: 'otp',
    //   context: { code, expiryMinutes },
    // });
  }

  /**
   * Send phone OTP via SMS (Termii)
   */
  async sendPhoneOtp(userId: string, phone: string): Promise<void> {
    const code = this.generateCode();
    const expiryMinutes = this.configService.get('OTP_EXPIRY_MINUTES', 10);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Invalidate previous OTPs
    await this.prisma.otpCode.updateMany({
      where: { userId, type: 'phone', isUsed: false },
      data: { isUsed: true },
    });

    // Create new OTP
    await this.prisma.otpCode.create({
      data: {
        userId,
        code,
        type: 'phone',
        expiresAt,
      },
    });

    // TODO: Send via Termii SMS API
    this.logger.log(`[DEV] Phone OTP for ${phone}: ${code}`);

    // Production SMS sending would go here:
    // await this.termiiService.sendOtp(phone, code);
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(userId: string, code: string, type: string): Promise<boolean> {
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        type,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return false;
    }

    // Mark as used
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    return true;
  }
}
