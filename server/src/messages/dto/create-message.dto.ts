import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ 
    example: 'Hey, how are you doing?', 
    description: 'Content of the message'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
