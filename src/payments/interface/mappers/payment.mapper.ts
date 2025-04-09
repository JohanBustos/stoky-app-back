import { Payment } from '../../domain/entities/payments.entity';
import { PaymentResponseDto } from '../dtos/payment-response.dto';

export class PaymentMapper {
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
