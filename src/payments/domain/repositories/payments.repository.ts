import { Payment } from '../entities/payments.entity';

export abstract class PaymentRepository {
  abstract create(payment: Payment): Promise<Payment>;

  abstract findById(id: string): Promise<Payment | null>;

  abstract findByQuoteId(quoteId: string): Promise<Payment[]>;

  abstract findAllPayments(): Promise<Payment[]>;

  abstract updateStatus(id: string, status: string): Promise<void>;

  abstract delete(id: string): Promise<void>;
}
