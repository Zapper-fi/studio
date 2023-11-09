import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ViemContractFactory } from '~apps/aave-v2/contracts';

import { ArbitrumRadiantCapitalPlatformFeesPositionFetcher } from './arbitrum/radiant-capital.platform-fees.contract-position-fetcher';
import { ArbitrumRadiantCapitalPositionPresenter } from './arbitrum/radiant-capital.position-presenter';
import { ArbitrumRadiantCapitalStableDebtTokenFetcher } from './arbitrum/radiant-capital.stable-debt.token-fetcher';
import { ArbitrumRadiantCapitalStakingContractPositionFetcher } from './arbitrum/radiant-capital.staking.contract-position-fetcher';
import { ArbitrumRadiantCapitalSupplyTokenFetcher } from './arbitrum/radiant-capital.supply.token-fetcher';
import { ArbitrumRadiantCapitalVariableDebtTokenFetcher } from './arbitrum/radiant-capital.variable-debt.token-fetcher';
import { RadiantCapitalViemContractFactory } from './contracts';

@Module({
  providers: [
    RadiantCapitalViemContractFactory,
    AaveV2ViemContractFactory,
    ArbitrumRadiantCapitalPositionPresenter,
    ArbitrumRadiantCapitalStableDebtTokenFetcher,
    ArbitrumRadiantCapitalSupplyTokenFetcher,
    ArbitrumRadiantCapitalVariableDebtTokenFetcher,
    ArbitrumRadiantCapitalPlatformFeesPositionFetcher,
    ArbitrumRadiantCapitalStakingContractPositionFetcher,
  ],
})
export class RadiantCapitalAppModule extends AbstractApp() {}
