import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AvalancheAaveV2ClaimableContractPositionFetcher } from './avalanche/aave-v2.claimable.contract-position-fetcher';
import { AvalancheAaveV2PositionPresenter } from './avalanche/aave-v2.position-presenter';
import { AvalancheAaveV2StableDebtTokenFetcher } from './avalanche/aave-v2.stable-debt.token-fetcher';
import { AvalancheAaveV2SupplyTokenFetcher } from './avalanche/aave-v2.supply.token-fetcher';
import { AvalancheAaveV2VariableDebtTokenFetcher } from './avalanche/aave-v2.variable-debt.token-fetcher';
import { AaveV2ViemContractFactory } from './contracts';
import { EthereumAaveV2ClaimableContractPositionFetcher } from './ethereum/aave-v2.claimable.contract-position-fetcher';
import { EthereumAaveV2PositionPresenter } from './ethereum/aave-v2.position-presenter';
import { EthereumAaveV2StableDebtTokenFetcher } from './ethereum/aave-v2.stable-debt.token-fetcher';
import { EthereumAaveV2SupplyTokenFetcher } from './ethereum/aave-v2.supply.token-fetcher';
import { EthereumAaveV2VariableDebtTokenFetcher } from './ethereum/aave-v2.variable-debt.token-fetcher';
import { PolygonAaveV2ClaimableContractPositionFetcher } from './polygon/aave-v2.claimable.contract-position-fetcher';
import { PolygonAaveV2PositionPresenter } from './polygon/aave-v2.position-presenter';
import { PolygonAaveV2StableDebtTokenFetcher } from './polygon/aave-v2.stable-debt.token-fetcher';
import { PolygonAaveV2SupplyTokenFetcher } from './polygon/aave-v2.supply.token-fetcher';
import { PolygonAaveV2VariableDebtTokenFetcher } from './polygon/aave-v2.variable-debt.token-fetcher';

@Module({
  providers: [
    AaveV2ViemContractFactory,
    AvalancheAaveV2ClaimableContractPositionFetcher,
    AvalancheAaveV2PositionPresenter,
    AvalancheAaveV2StableDebtTokenFetcher,
    AvalancheAaveV2SupplyTokenFetcher,
    AvalancheAaveV2VariableDebtTokenFetcher,
    EthereumAaveV2ClaimableContractPositionFetcher,
    EthereumAaveV2PositionPresenter,
    EthereumAaveV2StableDebtTokenFetcher,
    EthereumAaveV2SupplyTokenFetcher,
    EthereumAaveV2VariableDebtTokenFetcher,
    PolygonAaveV2ClaimableContractPositionFetcher,
    PolygonAaveV2PositionPresenter,
    PolygonAaveV2StableDebtTokenFetcher,
    PolygonAaveV2SupplyTokenFetcher,
    PolygonAaveV2VariableDebtTokenFetcher,
  ],
})
export class AaveV2AppModule extends AbstractApp() {}
