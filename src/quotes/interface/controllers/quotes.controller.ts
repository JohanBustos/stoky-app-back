import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/shared/guards/firebase-auth/firebase-auth.guard';
import { QuotesService } from '../../application/services/quotes.service';
import { CreateQuoteDto } from '../dtos/create-quote.dto';
import {
  QuoteDetailsResponseDto,
  QuoteResponseDto,
} from '../dtos/quote-response.dto';
import { Quote, QuoteItem } from '../../domain/entities/quote.entity';
import { FindQuotesDto } from '../dtos/find-quotes.dto';
import { PaginatedResponseDto } from '../dtos/paginated-response.dto';

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
        (item) =>
          new QuoteItem(item.productId, item.name, item.quantity, item.price),
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
  async findAll(
    @Query() filters: FindQuotesDto,
  ): Promise<PaginatedResponseDto<QuoteDetailsResponseDto>> {
    const { quotes, total } = await this.quotesService.findWithFilters(filters);
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    return new PaginatedResponseDto(
      quotes.map((quote) => QuoteDetailsResponseDto.fromEntityToDto(quote)),
      total,
      page,
      limit,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<QuoteDetailsResponseDto> {
    const quote = await this.quotesService.findById(id);
    return QuoteDetailsResponseDto.fromEntityToDto(quote);
  }
}
