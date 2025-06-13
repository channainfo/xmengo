import { IsString, IsNotEmpty, IsNumber, IsPositive, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum CryptoCurrency {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
  BNB = 'BNB',
  ADA = 'ADA',
}

export class VerifyCryptoPaymentDto {
  @ApiProperty({ 
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 
    description: 'Transaction hash or ID'
  })
  @IsString()
  @IsNotEmpty()
  txHash: string;

  @ApiProperty({ 
    enum: CryptoCurrency,
    example: CryptoCurrency.BTC,
    description: 'Cryptocurrency used for payment'
  })
  @IsEnum(CryptoCurrency)
  @IsNotEmpty()
  currency: CryptoCurrency;

  @ApiProperty({ 
    example: 0.0005, 
    description: 'Amount of cryptocurrency'
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
