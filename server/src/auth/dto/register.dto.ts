import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsDate, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

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
  interestedIn?: string[];

  @ApiProperty({ example: 'I love hiking and photography', description: 'User bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
}
