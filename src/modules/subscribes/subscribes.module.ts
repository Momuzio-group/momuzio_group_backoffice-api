import { Module } from '@nestjs/common';
import { SubscribesController } from './subscribes.controller';
import { SubscribesService } from './subscribes.service';

@Module({
  controllers: [SubscribesController],
  providers: [SubscribesService],
})
export class SubscribesModule {}
