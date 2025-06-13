import { IsString, IsOptional, IsDate, IsEnum, IsArray, IsBoolean, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Gender } from '../../users/dto/create-user.dto';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '1990-01-01', description: 'User date of birth', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @ApiProperty({ 
    enum: Gender,
    example: Gender.MALE,
    description: 'User gender',
    required: false
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ 
    example: ['female', 'other'],
    description: 'Genders the user is interested in',
    required: false,
    isArray: true
  })
  @IsOptional()
  @IsArray()
  interestedIn?: string[];

  @ApiProperty({ example: 'I love hiking and photography', description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'New York, NY', description: 'User location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 40.7128, description: 'User latitude', required: false })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiProperty({ example: -74.0060, description: 'User longitude', required: false })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiProperty({ 
    example: ['hiking', 'photography', 'travel'],
    description: 'User interests',
    required: false,
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiProperty({ example: true, description: 'Show profile in discovery', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 50, description: 'Maximum distance for matches in km', required: false })
  @IsOptional()
  maxDistance?: number;

  @ApiProperty({ example: [18, 35], description: 'Age range for matches', required: false })
  @IsOptional()
  @IsArray()
  ageRange?: number[];
}
