import { Controller, Get, Put, Patch, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateLandlordProfileDto } from './dto/update-landlord-profile.dto';
import { UpdateHunterProfileDto } from './dto/update-hunter-profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update basic profile info' })
  async updateProfile(@Req() req: any, @Body() data: { fullName?: string; profilePicture?: string; phone?: string }) {
    return this.usersService.updateProfile(req.user.id, data);
  }

  @Put('me/landlord')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update landlord profile details' })
  async updateLandlordProfile(@Req() req: any, @Body() dto: UpdateLandlordProfileDto) {
    return this.usersService.updateLandlordProfile(req.user.id, dto);
  }

  @Put('me/hunter')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update house hunter profile details' })
  async updateHunterProfile(@Req() req: any, @Body() dto: UpdateHunterProfileDto) {
    return this.usersService.updateHunterProfile(req.user.id, dto);
  }

  @Patch('me/fcm-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update FCM push notification token' })
  async updateFcmToken(@Req() req: any, @Body('fcmToken') fcmToken: string) {
    return this.usersService.updateFcmToken(req.user.id, fcmToken);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public user profile' })
  async getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get landlord reviews' })
  async getLandlordReviews(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.getLandlordReviews(id, page, limit);
  }
}
