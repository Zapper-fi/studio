import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MahalendContractFactory } from './contracts';
import { AaveV2ContractFactory } from '~apps/aave-v2/contracts';
import { EthereumAaveV2ClaimableContractPositionFetcher } from './ethereum/mahalend.claimable.contract-position-fetcher';
import { EthereumAaveV2PositionPresenter } from './ethereum/mahalend.position-presenter';
import { EthereumAaveV2StableDebtTokenFetcher } from './ethereum/mahalend.stable-debt.token-fetcher';
import { EthereumAaveV2SupplyTokenFetcher } from './ethereum/mahalend.supply.token-fetcher';
import { EthereumAaveV2VariableDebtTokenFetcher } from './ethereum/mahalend.variable-debt.token-fetcher';
import { ArbitrumAaveV2ClaimableContractPositionFetcher } from './arbitrum/mahalend.claimable.contract-position-fetcher';
import { ArbitrumAaveV2PositionPresenter } from './arbitrum/mahalend.position-presenter';
import { ArbitrumAaveV2StableDebtTokenFetcher } from './arbitrum/mahalend.stable-debt.token-fetcher';
import { ArbitrumAaveV2SupplyTokenFetcher } from './arbitrum/mahalend.supply.token-fetcher';
import { ArbitrumAaveV2VariableDebtTokenFetcher } from './arbitrum/mahalend.variable-debt.token-fetcher';

@Module({
  providers: [
    MahalendContractFactory,
    AaveV2ContractFactory,
    // EthereumAaveV2ClaimableContractPositionFetcher,
    EthereumAaveV2PositionPresenter,
    EthereumAaveV2StableDebtTokenFetcher,
    EthereumAaveV2SupplyTokenFetcher,
    EthereumAaveV2VariableDebtTokenFetcher,
    // ArbitrumAaveV2ClaimableContractPositionFetcher,
    ArbitrumAaveV2PositionPresenter,
    ArbitrumAaveV2StableDebtTokenFetcher,
    ArbitrumAaveV2SupplyTokenFetcher,
    ArbitrumAaveV2VariableDebtTokenFetcher,
  ],
})
export class MahalendAppModule extends AbstractApp() {}
