import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuotesModule } from './quotes/quotes.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [QuotesModule, PaymentsModule, UsersModule, SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
