import { CreateQuoteUseCase } from './create-quote.use-case';
import { FindAllUseCase } from './find-all.use-case';
import { MarkQuoteAsPaidUseCase } from './mark-quote-as-payment.use-case';

export const QuoteUseCases = [
  CreateQuoteUseCase,
  FindAllUseCase,
  MarkQuoteAsPaidUseCase,
];
