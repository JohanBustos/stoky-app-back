import {
  PaymentMethod,
  PaymentStatus,
} from '../../domain/entities/payments.entity';

export class PaymentResponseDto {
  id: string;
  quoteId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  reference?: string;
}
