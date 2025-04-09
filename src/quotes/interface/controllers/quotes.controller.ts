import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/shared/guards/firebase-auth/firebase-auth.guard';
import { QuotesService } from '../../application/services/quotes.service';
import { CreateQuoteDto } from '../dtos/create-quote.dto';
import {
  QuoteDetailsResponseDto,
  QuoteResponseDto,
} from '../dtos/quote-response.dto';
import { Quote, QuoteItem } from '../../domain/entities/quote.entity';

@UseGuards(FirebaseAuthGuard)
@Controller('quotes')
export class QuoteController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async createQuote(@Body() dto: CreateQuoteDto): Promise<QuoteResponseDto> {
    const quote = new Quote(
      undefined,
      dto.customerId,
      undefined,
      dto.totalAmount,
      dto.items.map(
        (item) => new QuoteItem(item.productId, item.quantity, item.price),
      ),
    );

    const created = await this.quotesService.createQuote(quote);

    return {
      id: created.id,
      customerId: created.customerId,
      createdAt: created.createdAt,
      totalAmount: created.totalAmount,
      status: created.paymentStatus,
    };
  }

  @Get()
  async findAll(): Promise<QuoteDetailsResponseDto[]> {
    const quotes = await this.quotesService.findAllQuote();
    return quotes.map((quote) =>
      QuoteDetailsResponseDto.fromEntityToDto(quote),
    );
  }
}
