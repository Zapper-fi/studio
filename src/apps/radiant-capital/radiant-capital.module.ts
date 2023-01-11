import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2/contracts';

import { ArbitrumRadiantCapitalPlatformFeesPositionFetcher } from './arbitrum/radiant-capital.platform-fees.contract-position-fetcher';
import { ArbitrumRadiantCapitalPositionPresenter } from './arbitrum/radiant-capital.position-presenter';
import { ArbitrumRadiantCapitalStableDebtTokenFetcher } from './arbitrum/radiant-capital.stable-debt.token-fetcher';
import { ArbitrumRadiantCapitalStakingContractPositionFetcher } from './arbitrum/radiant-capital.staking.contract-position-fetcher';
import { ArbitrumRadiantCapitalSupplyTokenFetcher } from './arbitrum/radiant-capital.supply.token-fetcher';
import { ArbitrumRadiantCapitalVariableDebtTokenFetcher } from './arbitrum/radiant-capital.variable-debt.token-fetcher';
import { RadiantCapitalContractFactory } from './contracts';
import { RadiantCapitalAppDefinition } from './radiant-capital.definition';

@Module({
  providers: [
    RadiantCapitalAppDefinition,
    RadiantCapitalContractFactory,
    AaveV2ContractFactory,
    ArbitrumRadiantCapitalPositionPresenter,
    ArbitrumRadiantCapitalStableDebtTokenFetcher,
    ArbitrumRadiantCapitalSupplyTokenFetcher,
    ArbitrumRadiantCapitalVariableDebtTokenFetcher,
    ArbitrumRadiantCapitalPlatformFeesPositionFetcher,
    ArbitrumRadiantCapitalStakingContractPositionFetcher,
  ],
})
export class RadiantCapitalAppModule extends AbstractApp() {}
