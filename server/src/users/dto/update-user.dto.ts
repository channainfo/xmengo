import { IsEmail, IsString, MinLength, IsOptional, IsDate, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Gender } from './create-user.dto';

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Password123!', description: 'User password', required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

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
}
