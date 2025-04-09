import { CreatePaymentUseCase } from './create-payment.use-case';
import { FindAllPaymentsUseCase } from './find-all-payments.use-case';
import { FindPaymentsByQuoteUseCase } from './detail-payments-by-quote.use-case';

export const PaymentsUseCases = [
  CreatePaymentUseCase,
  FindAllPaymentsUseCase,
  FindPaymentsByQuoteUseCase,
];
