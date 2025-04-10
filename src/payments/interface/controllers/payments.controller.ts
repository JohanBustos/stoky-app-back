import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
  Patch,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/shared/guards/firebase-auth/firebase-auth.guard';
import { PaymentsService } from '../../application/services/payments.service';
import { CreatePaymentDto } from '../dtos/create-payment.dto';
import { PaymentResponseDto } from '../dtos/payment-response.dto';
import { Payment } from '../../domain/entities/payments.entity';
import { v4 as uuidv4 } from 'uuid';
import { PaymentMapper } from '../mappers/payment.mapper';
import { FindPaymentsDto } from '../dtos/find-payments.dto';
import { PaginatedResponseDto } from '../dtos/paginated-response.dto';
import { UpdatePaymentStatusDto } from '../dtos/update-payment-status.dto';

@UseGuards(FirebaseAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = new Payment(
      uuidv4(),
      createPaymentDto.quoteId,
      createPaymentDto.amount,
      createPaymentDto.method,
      undefined,
      undefined,
      createPaymentDto.reference,
    );

    const createdPayment = await this.paymentsService.createPayment(payment);
    return PaymentMapper.toDto(createdPayment);
  }

  @Get('quote/:quoteId')
  async getPaymentsByQuote(@Param('quoteId') quoteId: string) {
    const payments = await this.paymentsService.getPaymentsByQuote(quoteId);
    return payments.map(PaymentMapper.toDto);
  }

  @Get()
  async getAllPayments() {
    const payments = await this.paymentsService.getAllPayments();
    return payments.map(PaymentMapper.toDto);
  }

  @Get('filter')
  async findWithFilters(@Query() filters: FindPaymentsDto) {
    const result = await this.paymentsService.findWithFilters(filters);
    return {
      payments: result.payments.map(PaymentMapper.toDto),
      total: result.total,
    };
  }

  @Patch(':id/status')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ) {
    await this.paymentsService.updatePaymentStatus(
      id,
      updatePaymentStatusDto.status,
    );
    return { message: 'Payment status updated successfully' };
  }
}
