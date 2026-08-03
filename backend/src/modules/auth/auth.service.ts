// ============================================================================
// Auth Service - Core Authentication Logic
// ============================================================================

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { OtpService } from './otp.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private otpService: OtpService,
  ) {}

  /**
   * Register a new user
   */
  async register(dto: RegisterDto) {
    // Check for existing user
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email or phone already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create user with role-specific profile
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role,
        fullName: dto.fullName,
        ...(dto.role === UserRole.LANDLORD && {
          landlordProfile: { create: {} },
        }),
        ...(dto.role === UserRole.HUNTER && {
          hunterProfile: { create: {} },
        }),
        subscriptions:
          dto.role === UserRole.LANDLORD
            ? { create: { plan: 'FREE', status: 'ACTIVE' } }
            : undefined,
      },
      include: {
        landlordProfile: true,
        hunterProfile: true,
      },
    });

    // Send verification OTP
    await this.otpService.sendEmailOtp(user.id, user.email);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.role);

    return {
      message: 'Registration successful. Please verify your email.',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Login with email and password
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        landlordProfile: true,
        hunterProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been suspended');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async loginWithGoogle(idToken: string) {
    // TODO: Verify the idToken using google-auth-library
    // const ticket = await client.verifyIdToken({ idToken, audience: CLIENT_ID });
    // const payload = ticket.getPayload();
    // const email = payload.email;
    
    // MOCK IMPLEMENTATION FOR NOW
    const email = 'mock.google.user@example.com';
    const fullName = 'Google User';

    return this.findOrCreateSocialUser(email, fullName, 'google');
  }

  async loginWithApple(idToken: string, firstName?: string, lastName?: string) {
    // TODO: Verify the idToken using apple-signin-auth
    // const payload = await appleSignin.verifyIdToken(idToken, { audience: CLIENT_ID });
    // const email = payload.email;
    
    // MOCK IMPLEMENTATION FOR NOW
    const email = 'mock.apple.user@example.com';
    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'Apple User';

    return this.findOrCreateSocialUser(email, fullName, 'apple');
  }

  private async findOrCreateSocialUser(email: string, fullName: string, provider: string) {
    let user = await this.prisma.user.findUnique({
      where: { email },
      include: { landlordProfile: true, hunterProfile: true },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          fullName,
          passwordHash: '', // No password for social logins
          role: UserRole.HUNTER, // Default role for social signups
          isEmailVerified: true, // Social emails are inherently verified
          hunterProfile: { create: {} },
        },
        include: { landlordProfile: true, hunterProfile: true },
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been suspended');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.role);

    return {
      message: 'Login successful',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshTokens(refreshToken: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke old token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    // Generate new tokens
    return this.generateTokens(storedToken.userId, storedToken.user.role);
  }

  /**
   * Logout - revoke refresh token
   */
  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, token: refreshToken },
        data: { isRevoked: true },
      });
    } else {
      // Revoke all refresh tokens for user
      await this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { isRevoked: true },
      });
    }

    await this.redisService.del(`user:online:${userId}`);

    return { message: 'Logged out successfully' };
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(userId: string, code: string) {
    const isValid = await this.otpService.verifyOtp(userId, code, 'email');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });

    return { message: 'Email verified successfully' };
  }

  /**
   * Request phone verification OTP
   */
  async requestPhoneOtp(userId: string, phone: string) {
    await this.otpService.sendPhoneOtp(userId, phone);
    return { message: 'OTP sent to your phone' };
  }

  /**
   * Verify phone with OTP
   */
  async verifyPhone(userId: string, code: string) {
    const isValid = await this.otpService.verifyOtp(userId, code, 'phone');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isPhoneVerified: true },
    });

    return { message: 'Phone verified successfully' };
  }

  /**
   * Forgot password - send reset OTP
   */
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If an account exists with this email, a reset code has been sent' };
    }

    await this.otpService.sendEmailOtp(user.id, email, 'reset_password');

    return { message: 'If an account exists with this email, a reset code has been sent' };
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid request');
    }

    const isValid = await this.otpService.verifyOtp(user.id, code, 'reset_password');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Revoke all refresh tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { isRevoked: true },
    });

    return { message: 'Password reset successful. Please login with your new password.' };
  }

  // ── Private Helpers ──────────────────────────────────────────────────

  private async generateTokens(userId: string, role: UserRole) {
    const payload = { sub: userId, role };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = uuid();
    const refreshExpiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(refreshExpiresIn) || 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
    };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}
