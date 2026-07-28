import { IsString, IsOptional, IsNumber, IsArray, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';

export class UpdateHunterProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() occupation?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) budgetMin?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) budgetMax?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() preferredStates?: string[];
  @ApiPropertyOptional() @IsOptional() @IsArray() preferredCities?: string[];
  @ApiPropertyOptional() @IsOptional() @IsEnum(PropertyType) preferredPropertyType?: PropertyType;
  @ApiPropertyOptional() @IsOptional() @IsNumber() desiredBedrooms?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() moveInDate?: string;
}
