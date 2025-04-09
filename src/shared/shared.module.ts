import { Module } from '@nestjs/common';
import { FirebaseAuthGuard } from './guards/firebase-auth/firebase-auth.guard';

@Module({
  providers: [FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class SharedModule {}
