import {
  IsString, IsNumber, IsEnum, IsOptional, IsBoolean,
  IsArray, IsDateString, Min, MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType, PropertyStatus } from '@prisma/client';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Luxury 3-Bedroom Apartment in Lekki Phase 1' })
  @IsString()
  @MinLength(10)
  title: string;

  @ApiProperty({ example: 'A beautifully furnished 3-bedroom apartment with modern amenities...' })
  @IsString()
  @MinLength(20)
  description: string;

  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiPropertyOptional({ enum: PropertyStatus, default: 'DRAFT' })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  toilets?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsNumber()
  squareMeters?: number;

  @ApiProperty({ example: 2500000 })
  @IsNumber()
  @Min(0)
  rentAmount: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  serviceCharge?: number;

  @ApiPropertyOptional({ example: 250000 })
  @IsOptional()
  @IsNumber()
  agencyFee?: number;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  legalFee?: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  cautionFee?: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsNumber()
  agreementFee?: number;

  @ApiProperty({ example: '12 Admiralty Way, Lekki Phase 1' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Lagos' })
  @IsString()
  state: string;

  @ApiProperty({ example: 'Eti-Osa' })
  @IsString()
  lga: string;

  @ApiPropertyOptional({ example: 'Lekki Phase 1' })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional({ example: 'Admiralty Way' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ example: 6.4281 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 3.4219 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: ['Shoprite', 'Lekki Toll Gate'] })
  @IsOptional()
  @IsArray()
  nearbyLandmarks?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  availabilityDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsBoolean() isFurnished?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isNewlyBuilt?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isRenovated?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() petsAllowed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() smokingAllowed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasParking?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasWaterSupply?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasElectricity?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasGenerator?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasSolar?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasSecurity?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasInternet?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasSwimmingPool?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasGym?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasBalcony?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasPopCeiling?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasWardrobes?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasKitchenCabinets?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasAirConditioning?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasWaterHeater?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasBorehole?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasCctv?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isGatedEstate?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hasAccessibility?: boolean;
}
