import { CreatePaymentUseCase } from './create-payment.use-case';
import { FindAllPaymentsUseCase } from './find-all-payments.use-case';
import { FindPaymentsByQuoteUseCase } from './detail-payments-by-quote.use-case';
import { FindWithFiltersUseCase } from './find-with-filters.use-case';
import { UpdatePaymentStatusUseCase } from './update-payment-status.use-case';

export const PaymentsUseCases = [
  CreatePaymentUseCase,
  FindAllPaymentsUseCase,
  FindPaymentsByQuoteUseCase,
  FindWithFiltersUseCase,
  UpdatePaymentStatusUseCase,
];
