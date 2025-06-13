import { Controller, Get, Post, Body, Delete, UseGuards, Req, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { VerifyCryptoPaymentDto } from './dto/verify-crypto-payment.dto';

@ApiTags('payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('methods')
  @ApiOperation({ summary: 'Get user payment methods' })
  @ApiResponse({ status: 200, description: 'Return payment methods' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getPaymentMethods(@Req() req) {
    return this.paymentsService.getPaymentMethods(req.user.id);
  }

  @Post('methods')
  @ApiOperation({ summary: 'Add a payment method' })
  @ApiResponse({ status: 201, description: 'Payment method added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  addPaymentMethod(@Req() req, @Body() paymentMethodData: any) {
    return this.paymentsService.addPaymentMethod(req.user.id, paymentMethodData);
  }

  @Post('methods/:paymentMethodId/default')
  @ApiOperation({ summary: 'Set default payment method' })
  @ApiResponse({ status: 200, description: 'Default payment method updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  setDefaultPaymentMethod(@Req() req, @Param('paymentMethodId') paymentMethodId: string) {
    return this.paymentsService.setDefaultPaymentMethod(req.user.id, paymentMethodId);
  }

  @Delete('methods/:paymentMethodId')
  @ApiOperation({ summary: 'Remove a payment method' })
  @ApiResponse({ status: 200, description: 'Payment method removed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  removePaymentMethod(@Req() req, @Param('paymentMethodId') paymentMethodId: string) {
    return this.paymentsService.removePaymentMethod(req.user.id, paymentMethodId);
  }

  @Post('process')
  @ApiOperation({ summary: 'Process a payment' })
  @ApiResponse({ status: 201, description: 'Payment processed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  processPayment(
    @Req() req,
    @Body() paymentData: ProcessPaymentDto,
  ) {
    return this.paymentsService.processPayment(
      req.user.id,
      paymentData.amount,
      paymentData.currency,
      paymentData.paymentMethodId,
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history' })
  @ApiResponse({ status: 200, description: 'Return payment history' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getPaymentHistory(@Req() req) {
    return this.paymentsService.getPaymentHistory(req.user.id);
  }

  @Get('crypto/:currency/address')
  @ApiOperation({ summary: 'Get cryptocurrency payment address' })
  @ApiResponse({ status: 200, description: 'Return crypto payment address' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Unsupported cryptocurrency' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getCryptoPaymentAddress(@Req() req, @Param('currency') currency: string) {
    return this.paymentsService.getCryptoPaymentAddress(req.user.id, currency);
  }

  @Post('crypto/verify')
  @ApiOperation({ summary: 'Verify cryptocurrency payment' })
  @ApiResponse({ status: 201, description: 'Crypto payment verified successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  verifyCryptoPayment(
    @Req() req,
    @Body() verifyData: VerifyCryptoPaymentDto,
  ) {
    return this.paymentsService.verifyCryptoPayment(
      req.user.id,
      verifyData.txHash,
      verifyData.currency,
      verifyData.amount,
    );
  }
}
