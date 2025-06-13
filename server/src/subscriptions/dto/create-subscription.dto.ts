import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ 
    example: 'premium', 
    description: 'ID of the subscription plan',
    enum: ['basic', 'premium', 'platinum']
  })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ 
    example: 'pm_credit_card', 
    description: 'ID of the payment method to use'
  })
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
