import { Quote } from '../../domain/entities/quote.entity';
import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllUseCase {
  constructor(private readonly quotesRepository: QuotesRepository) {}

  async execute(): Promise<Quote[]> {
    return this.quotesRepository.findAll();
  }
}
