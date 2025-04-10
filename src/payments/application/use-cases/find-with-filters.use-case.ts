import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { FindPaymentsDto } from '../../interface/dtos/find-payments.dto';
import { Payment } from '../../domain/entities/payments.entity';

@Injectable()
export class FindWithFiltersUseCase {
  constructor(private readonly paymentsRepository: PaymentRepository) {}

  async execute(
    filters: FindPaymentsDto,
  ): Promise<{ payments: Payment[]; total: number }> {
    return this.paymentsRepository.findWithFilters(filters);
  }
}
