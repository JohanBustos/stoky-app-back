import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../../domain/entities/payments.entity';

export class CreatePaymentDto {
  @IsString()
  quoteId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;
}
