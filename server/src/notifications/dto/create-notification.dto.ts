import { IsNotEmpty, IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
  MATCH = 'match',
  MESSAGE = 'message',
  LIKE = 'like',
  SUBSCRIPTION = 'subscription',
  PAYMENT = 'payment',
  SYSTEM = 'system',
}

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID who should receive the notification',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.MATCH,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Notification title',
    example: 'New Match!',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'You have a new match with Jane!',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Related entity ID (match ID, message ID, etc.)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiProperty({
    description: 'Additional data in JSON format',
    example: '{"matchName": "Jane", "matchPhoto": "url-to-photo"}',
    required: false,
  })
  @IsOptional()
  @IsString()
  data?: string;
}
