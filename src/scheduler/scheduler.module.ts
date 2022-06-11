import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { SchedulerService } from './scheduler.service';

@Module({
  imports: [DiscoveryModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
