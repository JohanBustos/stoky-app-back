import { Injectable } from '@nestjs/common';
import { CreateQuoteUseCase } from '../use-cases/create-quote.use-case';
import { FindAllUseCase } from '../use-cases/find-all.use-case';
import { Quote } from '../../domain/entities/quote.entity';

@Injectable()
export class QuotesService {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly findAllQuoteUseCase: FindAllUseCase,
  ) {}

  async createQuote(quote: Quote): Promise<Quote> {
    return this.createQuoteUseCase.execute(quote);
  }

  async findAllQuote(): Promise<Quote[]> {
    return this.findAllQuoteUseCase.execute();
  }
}
