import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async getPaymentMethods(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // In a real app, we would fetch payment methods from a payment gateway
    // For now, return mock data
    return [
      {
        id: 'pm_credit_card',
        type: 'credit_card',
        brand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
      },
      {
        id: 'pm_crypto_btc',
        type: 'crypto',
        currency: 'BTC',
        address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
        isDefault: false,
      },
      {
        id: 'pm_crypto_eth',
        type: 'crypto',
        currency: 'ETH',
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        isDefault: false,
      },
    ];
  }

  async addPaymentMethod(userId: string, paymentMethodData: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // In a real app, we would add the payment method to a payment gateway
    // For now, return mock data
    return {
      id: `pm_${Date.now()}`,
      type: paymentMethodData.type,
      ...paymentMethodData,
      isDefault: false,
    };
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // In a real app, we would update the default payment method in a payment gateway
    // For now, return success message
    return {
      message: 'Default payment method updated successfully',
      paymentMethodId,
    };
  }

  async removePaymentMethod(userId: string, paymentMethodId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // In a real app, we would remove the payment method from a payment gateway
    // For now, return success message
    return {
      message: 'Payment method removed successfully',
      paymentMethodId,
    };
  }

  async processPayment(userId: string, amount: number, currency: string, paymentMethodId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // In a real app, we would process the payment through a payment gateway
    // For now, simulate a successful payment
    const paymentId = `pay_${Date.now()}`;
    
    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        user: { connect: { id: userId } },
        amount,
        currency,
        paymentMethodId,
        status: 'completed',
        paymentId,
      },
    });

    return {
      success: true,
      payment,
    };
  }

  async getPaymentHistory(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get payment history from database
    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return payments;
  }

  async getCryptoPaymentAddress(userId: string, currency: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate cryptocurrency
    const supportedCurrencies = ['BTC', 'ETH', 'USDT', 'BNB', 'ADA'];
    if (!supportedCurrencies.includes(currency)) {
      throw new BadRequestException('Unsupported cryptocurrency');
    }

    // In a real app, we would generate or fetch a payment address from a crypto payment processor
    // For now, return mock data
    const addresses = {
      BTC: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
      ETH: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      BNB: 'bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m',
      ADA: 'addr1qxck5sxlpvz3z4pnym0zcl3xdnrfrjtz6470tpvqq08qnua8v5wjqstn8hj3dnfm0yg247lxue2k5xm7rxcdfywu8cxsrz37tk',
    };

    return {
      currency,
      address: addresses[currency],
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${addresses[currency]}`,
    };
  }

  async verifyCryptoPayment(userId: string, txHash: string, currency: string, amount: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // In a real app, we would verify the transaction on the blockchain
    // For now, simulate a successful verification
    
    // Create payment record
    // Note: We can't store metadata directly as it's not in the schema
    // We could consider adding a data JSON field to the Payment model in the future
    const payment = await this.prisma.payment.create({
      data: {
        user: { connect: { id: userId } },
        amount,
        currency,
        paymentMethodId: `crypto_${currency.toLowerCase()}`,
        status: 'completed',
        paymentId: txHash,
      },
    });
    
    // For now, we'll just log the blockchain info that we would have stored
    const blockchain = currency === 'BTC' ? 'Bitcoin' : 
                      currency === 'ETH' || currency === 'USDT' ? 'Ethereum' : 
                      currency === 'BNB' ? 'Binance Smart Chain' : 
                      'Cardano';
    console.log(`Transaction ${txHash} processed on ${blockchain} blockchain`);

    return {
      success: true,
      payment,
    };
  }
}
