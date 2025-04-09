import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { Payment, PaymentStatus } from '../../domain/entities/payments.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebasePaymentsRepository implements PaymentRepository {
  private payments: Payment[] = [];

  async create(payment: Payment): Promise<Payment> {
    const newPayment = new Payment(
      payment.id || uuidv4(),
      payment.quoteId,
      payment.amount,
      payment.method,
      payment.status || PaymentStatus.PENDING,
      payment.createdAt || new Date(),
      payment.reference,
    );

    this.payments.push(newPayment);
    return newPayment;
  }

  async findById(id: string): Promise<Payment | null> {
    const found = this.payments.find((p) => p.id === id);
    return found || null;
  }

  async findByQuoteId(quoteId: string): Promise<Payment[]> {
    return this.payments.filter((p) => p.quoteId === quoteId);
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<void> {
    const index = this.payments.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.payments[index].status = status;
    }
  }

  async delete(id: string): Promise<void> {
    this.payments = this.payments.filter((p) => p.id !== id);
  }

  async findAllPayments(): Promise<Payment[]> {
    return this.payments;
  }
}
