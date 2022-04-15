import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { BalanceFetcherRegistry } from './balance-fetcher.registry';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';

@Module({
  imports: [DiscoveryModule],
  providers: [BalanceFetcherRegistry, BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
