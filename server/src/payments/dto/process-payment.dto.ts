import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessPaymentDto {
  @ApiProperty({ 
    example: 9.99, 
    description: 'Amount to charge'
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ 
    example: 'USD', 
    description: 'Currency code'
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ 
    example: 'pm_credit_card', 
    description: 'ID of the payment method to use'
  })
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
