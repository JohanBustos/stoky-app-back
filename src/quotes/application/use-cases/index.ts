import { CreateQuoteUseCase } from './create-quote.use-case';
import { FindAllUseCase } from './find-all.use-case';
import { MarkQuoteAsPaidUseCase } from './mark-quote-as-payment.use-case';
import { FindWithFiltersUseCase } from './find-with-filters.use-case';
import { FindByIdUseCase } from './find-by-id.use-case';

export const QuoteUseCases = [
  CreateQuoteUseCase,
  FindAllUseCase,
  MarkQuoteAsPaidUseCase,
  FindWithFiltersUseCase,
  FindByIdUseCase,
];
