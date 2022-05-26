import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { AppModule } from '~app/app.module';
import { MulticallModule } from '~multicall/multicall.module';
import { NetworkProviderModule } from '~network-provider/network-provider.module';
import { PositionModule } from '~position/position.module';

import { BalanceAfterwareRegistry } from './balance-afterware.registry';
import { BalanceFetcherRegistry } from './balance-fetcher.registry';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { DefaultContractPositionBalanceFetcherFactory } from './default.contract-position-balance-fetcher.factory';
import { DefaultTokenBalanceFetcherFactory } from './default.token-balance-fetcher.factory';

@Module({
  imports: [DiscoveryModule, MulticallModule, NetworkProviderModule, PositionModule, AppModule],
  providers: [
    BalanceFetcherRegistry,
    BalanceAfterwareRegistry,
    BalanceService,
    DefaultTokenBalanceFetcherFactory,
    DefaultContractPositionBalanceFetcherFactory,
  ],
  controllers: [BalanceController],
})
export class BalanceModule {}
