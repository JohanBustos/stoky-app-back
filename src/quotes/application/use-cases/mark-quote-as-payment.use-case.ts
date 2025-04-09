import { QuotesRepository } from '../../domain/repositories/quotes.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MarkQuoteAsPaidUseCase {
  constructor(private readonly quoteRepository: QuotesRepository) {}

  async execute(quoteId: string): Promise<void> {
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      throw new NotFoundException('Quote not found');
    }

    quote.markAsPaid();
    await this.quoteRepository.update(quote);
  }
}
