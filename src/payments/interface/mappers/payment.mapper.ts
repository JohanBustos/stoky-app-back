import { Payment, PaymentStatus } from '../../domain/entities/payments.entity';
import * as admin from 'firebase-admin';
import { PaymentResponseDto } from '../dtos/payment-response.dto';

export class PaymentMapper {
  static toFirestore(payment: Payment): any {
    return {
      id: payment.id,
      quoteId: payment.quoteId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      createdAt: admin.firestore.Timestamp.fromDate(
        payment.createdAt ?? new Date(),
      ),
      reference: payment.reference ?? null,
    };
  }

  static fromFirestore(
    id: string,
    data: FirebaseFirestore.DocumentData,
  ): Payment {
    return new Payment(
      id,
      data.quoteId,
      data.amount,
      data.method,
      data.status as PaymentStatus,
      data.createdAt?.toDate?.() ?? new Date(data.createdAt),
      data.reference ?? undefined,
    );
  }

  static toDto(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      quoteId: payment.quoteId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      createdAt: payment.createdAt,
      reference: payment.reference,
    };
  }
}
