import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLandlordProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() agencyName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsappNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() about?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) yearsOfExperience?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() officeLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() preferredContactHours?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() languages?: string[];
}
