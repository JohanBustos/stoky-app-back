import { Quote } from '../../domain/entities/quote.entity';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateQuoteUseCase {
  constructor(private readonly quotesRepository: QuotesRepository) {}

  async execute(quote: Quote): Promise<Quote> {
    return this.quotesRepository.create(quote);
  }
}
