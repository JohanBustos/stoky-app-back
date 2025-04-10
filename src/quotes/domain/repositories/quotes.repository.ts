import { Quote } from '../entities/quote.entity';
import { FindQuotesDto } from '../../interface/dtos/find-quotes.dto';

export abstract class QuotesRepository {
  abstract create(quote: Quote): Promise<Quote>;
  abstract findAll(): Promise<Quote[]>;
  abstract findById(id: string): Promise<Quote | null>;
  abstract update(quote: Quote): Promise<Quote>;
  abstract findWithFilters(
    filters: FindQuotesDto,
  ): Promise<{ quotes: Quote[]; total: number }>;
}
