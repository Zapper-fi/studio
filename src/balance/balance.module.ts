import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppModule } from '~app/app.module';
import { NetworkProviderModule } from '~network-provider/network-provider.module';
import { PositionModule } from '~position/position.module';

import { BalanceFetcherRegistry } from './balance-fetcher.registry';
import { BalancePresentationService } from './balance-presentation.service';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { DefaultContractPositionBalanceFetcherFactory } from './default.contract-position-balance-fetcher.factory';
import { DefaultTokenBalanceFetcherFactory } from './default.token-balance-fetcher.factory';

@Module({
  imports: [DiscoveryModule, PositionModule, NetworkProviderModule, AppModule, AppToolkitModule],
  providers: [
    BalanceFetcherRegistry,
    BalancePresentationService,
    BalanceService,
    DefaultContractPositionBalanceFetcherFactory,
    DefaultTokenBalanceFetcherFactory,
  ],
  controllers: [BalanceController],
})
export class BalanceModule {}
