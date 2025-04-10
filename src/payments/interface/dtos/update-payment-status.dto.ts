import { IsEnum } from 'class-validator';
import { PaymentStatus } from '../../domain/entities/payments.entity';

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
