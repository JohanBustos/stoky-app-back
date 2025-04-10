import { Module } from '@nestjs/common';
import { PaymentsController } from './interface/controllers/payments.controller';
import { PaymentsService } from './application/services/payments.service';
import { PaymentRepository } from './domain/repositories/payments.repository';
import { FirebasePaymentsRepository } from './infrastructure/repositories/firebase-payments.repository';
import { PaymentsUseCases } from './application/use-cases';
import { QuotesModule } from '../quotes/quotes.module';

@Module({
  imports: [QuotesModule],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    ...PaymentsUseCases,
    {
      provide: PaymentRepository,
      useClass: FirebasePaymentsRepository,
    },
  ],
})
export class PaymentsModule {}
