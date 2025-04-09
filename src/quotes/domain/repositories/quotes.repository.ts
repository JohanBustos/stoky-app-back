import { Quote } from '../entities/quote.entity';
export abstract class QuotesRepository {
  abstract create(quote: Quote): Promise<Quote>;
  abstract findAll(): Promise<Quote[]>;
  abstract findById(id: string): Promise<Quote | null>;
  abstract update(quote: Quote): Promise<Quote>;
}
