import { Injectable } from '@nestjs/common';
import { CreatePaymentUseCase } from '../use-cases/create-payment.use-case';
import { FindPaymentsByQuoteUseCase } from '../use-cases/detail-payments-by-quote.use-case';
import { FindAllPaymentsUseCase } from '../use-cases/find-all-payments.use-case';
import { FindWithFiltersUseCase } from '../use-cases/find-with-filters.use-case';
import { UpdatePaymentStatusUseCase } from '../use-cases/update-payment-status.use-case';
import { Payment, PaymentStatus } from '../../domain/entities/payments.entity';
import { FindPaymentsDto } from '../../interface/dtos/find-payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly findPaymentsByQuoteUseCase: FindPaymentsByQuoteUseCase,
    private readonly findAllPaymentsUseCase: FindAllPaymentsUseCase,
    private readonly findWithFiltersUseCase: FindWithFiltersUseCase,
    private readonly updatePaymentStatusUseCase: UpdatePaymentStatusUseCase,
  ) {}

  async createPayment(payment: Payment): Promise<Payment> {
    return this.createPaymentUseCase.execute(payment);
  }

  async getPaymentsByQuote(quoteId: string): Promise<Payment[]> {
    return this.findPaymentsByQuoteUseCase.execute(quoteId);
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.findAllPaymentsUseCase.execute();
  }

  async findWithFilters(
    filters: FindPaymentsDto,
  ): Promise<{ payments: Payment[]; total: number }> {
    return this.findWithFiltersUseCase.execute(filters);
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<void> {
    return this.updatePaymentStatusUseCase.execute(id, status);
  }
}
