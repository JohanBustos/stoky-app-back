import { Injectable } from '@nestjs/common';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import { FindQuotesDto } from '../../interface/dtos/find-quotes.dto';
import { Quote } from '../../domain/entities/quote.entity';

@Injectable()
export class FindWithFiltersUseCase {
  constructor(private readonly quotesRepository: QuotesRepository) {}

  async execute(
    filters: FindQuotesDto,
  ): Promise<{ quotes: Quote[]; total: number }> {
    return this.quotesRepository.findWithFilters(filters);
  }
}
