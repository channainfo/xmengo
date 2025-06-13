import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPhotoDto {
  @ApiProperty({ 
    example: 'https://storage.example.com/photos/user123/photo1.jpg', 
    description: 'URL of the photo'
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ 
    example: true, 
    description: 'Whether this photo should be set as the main profile photo',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isMain?: boolean;
}
