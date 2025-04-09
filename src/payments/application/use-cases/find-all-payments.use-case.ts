import { Payment } from '../../domain/entities/payments.entity';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllPaymentsUseCase {
  constructor(private readonly paymentsRepository: PaymentRepository) {}

  async execute(): Promise<Payment[]> {
    return this.paymentsRepository.findAllPayments();
  }
}
