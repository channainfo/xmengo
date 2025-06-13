import { IsOptional, IsNumber, IsArray, IsString, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SortBy {
  DISTANCE = 'distance',
  AGE = 'age',
  INTERESTS = 'interests',
  NEWEST = 'newest',
}

export class FilterProfilesDto {
  @ApiProperty({ 
    example: 10, 
    description: 'Number of profiles to return per page',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiProperty({ 
    example: 1, 
    description: 'Page number for pagination',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    example: [18, 35], 
    description: 'Age range [min, max]',
    required: false
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  ageRange?: number[];

  @ApiProperty({ 
    example: 50, 
    description: 'Maximum distance in kilometers',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(500)
  maxDistance?: number;

  @ApiProperty({ 
    example: ['hiking', 'photography'], 
    description: 'Filter by interests',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiProperty({ 
    enum: SortBy,
    example: SortBy.DISTANCE,
    description: 'Sort results by this field',
    required: false
  })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.DISTANCE;
}
