import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { Payment, PaymentStatus } from '../../domain/entities/payments.entity';

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(id: string, status: PaymentStatus): Promise<void> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    await this.paymentRepository.updateStatus(id, status);
  }
}
