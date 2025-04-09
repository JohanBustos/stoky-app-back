import { Payment } from '../../domain/entities/payments.entity';
import { PaymentRepository } from '../../domain/repositories/payments.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QuotesRepository } from '../../../quotes/domain/repositories/quotes.repository';
import { MarkQuoteAsPaidUseCase } from '../../../quotes/application/use-cases/mark-quote-as-payment.use-case';
import { QuotePaymentStatus } from '../../../quotes/domain/entities/quote.entity';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly quoteRepository: QuotesRepository,
    private readonly markQuoteAsPaidUseCase: MarkQuoteAsPaidUseCase,
  ) {}

  async execute(payment: Payment): Promise<Payment> {
    const created = await this.paymentRepository.create(payment);

    const allPayments = await this.paymentRepository.findByQuoteId(
      payment.quoteId,
    );
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    const quote = await this.quoteRepository.findById(payment.quoteId);
    if (!quote || !quote.id) {
      throw new NotFoundException('Quote not found');
    }

    if (
      totalPaid >= quote.totalAmount &&
      quote.paymentStatus !== QuotePaymentStatus.PAID
    ) {
      await this.markQuoteAsPaidUseCase.execute(quote.id);
    }

    return created;
  }
}
