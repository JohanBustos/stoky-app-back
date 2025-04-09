import { Payment } from '../../domain/entities/payments.entity';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindPaymentsByQuoteUseCase {
  constructor(private readonly paymentsRepository: PaymentRepository) {}

  async execute(quoteId: string): Promise<Payment[]> {
    return this.paymentsRepository.findByQuoteId(quoteId);
  }
}
