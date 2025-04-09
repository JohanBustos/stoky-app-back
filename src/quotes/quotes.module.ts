import { Module } from '@nestjs/common';
import { QuoteController } from './interface/controllers/quotes.controller';
import { QuotesService } from './application/services/quotes.service';
import { QuoteUseCases } from './application/use-cases';
import { QuotesRepository } from './domain/repositories/quotes.repository';
import { FirebaseQuoteRepository } from './infrastructure/repositories/firebase-quote.repository';
import { MarkQuoteAsPaidUseCase } from './application/use-cases/mark-quote-as-payment.use-case';

@Module({
  controllers: [QuoteController],
  providers: [
    QuotesService,
    ...QuoteUseCases,
    {
      provide: QuotesRepository,
      useClass: FirebaseQuoteRepository,
    },
  ],
  exports: [QuotesRepository, MarkQuoteAsPaidUseCase],
})
export class QuotesModule {}
