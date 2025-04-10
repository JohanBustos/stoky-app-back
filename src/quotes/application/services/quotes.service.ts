import { Injectable } from '@nestjs/common';
import { CreateQuoteUseCase } from '../use-cases/create-quote.use-case';
import { FindAllUseCase } from '../use-cases/find-all.use-case';
import { FindWithFiltersUseCase } from '../use-cases/find-with-filters.use-case';
import { FindByIdUseCase } from '../use-cases/find-by-id.use-case';
import { Quote } from '../../domain/entities/quote.entity';
import { FindQuotesDto } from '../../interface/dtos/find-quotes.dto';

@Injectable()
export class QuotesService {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly findAllQuoteUseCase: FindAllUseCase,
    private readonly findWithFiltersUseCase: FindWithFiltersUseCase,
    private readonly findByIdUseCase: FindByIdUseCase,
  ) {}

  async createQuote(quote: Quote): Promise<Quote> {
    return this.createQuoteUseCase.execute(quote);
  }

  async findAllQuote(): Promise<Quote[]> {
    return this.findAllQuoteUseCase.execute();
  }

  async findWithFilters(
    filters: FindQuotesDto,
  ): Promise<{ quotes: Quote[]; total: number }> {
    return this.findWithFiltersUseCase.execute(filters);
  }

  async findById(id: string): Promise<Quote> {
    return this.findByIdUseCase.execute(id);
  }
}
