import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import { Quote } from '../../domain/entities/quote.entity';

@Injectable()
export class FindByIdUseCase {
  constructor(private readonly quotesRepository: QuotesRepository) {}

  async execute(id: string): Promise<Quote> {
    const quote = await this.quotesRepository.findById(id);

    if (!quote) {
      throw new NotFoundException(`Quote with ID ${id} not found`);
    }

    return quote;
  }
}
