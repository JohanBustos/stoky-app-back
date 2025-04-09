import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/shared/guards/firebase-auth/firebase-auth.guard';
import { PaymentsService } from '../../application/services/payments.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PaymentResponseDto } from '../dtos/payment-response.dto';
import { Payment } from '../../domain/entities/payments.entity';
import { v4 as uuidv4 } from 'uuid';
import { PaymentMapper } from '../mappers/payment.mapper';

@UseGuards(FirebaseAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    const payment = new Payment(
      uuidv4(),
      dto.quoteId,
      dto.amount,
      dto.method,
      undefined,
      new Date(),
      dto.reference,
    );

    const created = await this.paymentsService.createPayment(payment);
    return PaymentMapper.toDto(created);
  }

  @Get('quote/:quoteId')
  async findByQuote(@Param('quoteId') quoteId: string): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentsService.getPaymentsByQuote(quoteId);
    return payments.map((payment) => PaymentMapper.toDto(payment));
  }

  @Get()
  async findAll(): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentsService.getAllPayments();
    return payments.map((payment) => PaymentMapper.toDto(payment));
  }
}
