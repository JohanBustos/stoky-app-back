import { Payment } from '../entities/payments.entity';
import { FindPaymentsDto } from '../../interface/dtos/find-payments.dto';

export abstract class PaymentRepository {
  abstract create(payment: Payment): Promise<Payment>;

  abstract findById(id: string): Promise<Payment | null>;

  abstract findByQuoteId(quoteId: string): Promise<Payment[]>;

  abstract findAllPayments(): Promise<Payment[]>;

  abstract updateStatus(id: string, status: string): Promise<void>;

  abstract delete(id: string): Promise<void>;

  abstract findWithFilters(
    filters: FindPaymentsDto,
  ): Promise<{ payments: Payment[]; total: number }>;
}
