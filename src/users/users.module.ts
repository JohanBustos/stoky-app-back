import { Module } from '@nestjs/common';
import { ControllersController } from './interface/controllers/controllers.controller';

@Module({
  controllers: [ControllersController],
})
export class UsersModule {}
