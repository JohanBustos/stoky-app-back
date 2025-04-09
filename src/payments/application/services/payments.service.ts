import { Injectable } from '@nestjs/common';
import { CreatePaymentUseCase } from '../use-cases/create-payment.use-case';
import { FindPaymentsByQuoteUseCase } from '../use-cases/detail-payments-by-quote.use-case';
import { FindAllPaymentsUseCase } from '../use-cases/find-all-payments.use-case';
import { Payment } from '../../domain/entities/payments.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly findPaymentsByQuoteUseCase: FindPaymentsByQuoteUseCase,
    private readonly findAllPaymentsUseCase: FindAllPaymentsUseCase,
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
}
