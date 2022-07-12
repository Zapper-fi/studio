import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { AppToolkitModule } from '~app-toolkit/app-toolkit.module';
import { AppModule } from '~app/app.module';
import { NetworkProviderModule } from '~network-provider/network-provider.module';
import { PositionModule } from '~position/position.module';

import { BalanceFetcherRegistry } from './balance-fetcher.registry';
import { BalancePresenterRegistry } from './balance-presenter.registry';
import { BalanceController } from './balance.controller';
import { BalanceService } from './balance.service';
import { DefaultBalancePresenterFactory } from './default.balance-presenter.factory';
import { DefaultContractPositionBalanceFetcherFactory } from './default.contract-position-balance-fetcher.factory';
import { DefaultTokenBalanceFetcherFactory } from './default.token-balance-fetcher.factory';

@Module({
  imports: [DiscoveryModule, PositionModule, NetworkProviderModule, AppModule, AppToolkitModule],
  providers: [
    BalanceFetcherRegistry,
    BalancePresenterRegistry,
    BalanceService,
    DefaultTokenBalanceFetcherFactory,
    DefaultContractPositionBalanceFetcherFactory,
    DefaultBalancePresenterFactory,
  ],
  controllers: [BalanceController],
})
export class BalanceModule {}
