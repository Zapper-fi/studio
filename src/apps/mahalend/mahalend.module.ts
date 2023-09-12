import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MahalendContractFactory } from './contracts';
// import { MahalendContractFactory } from '~apps/aave-v2/contracts';
// import { EthereumMahalendClaimableContractPositionFetcher } from './ethereum/mahalend.claimable.contract-position-fetcher';
import { EthereumMahalendPositionPresenter } from './ethereum/mahalend.position-presenter';
import { EthereumMahalendStableDebtTokenFetcher } from './ethereum/mahalend.stable-debt.token-fetcher';
import { EthereumMahalendSupplyTokenFetcher } from './ethereum/mahalend.supply.token-fetcher';
import { EthereumMahalendVariableDebtTokenFetcher } from './ethereum/mahalend.variable-debt.token-fetcher';
// import { ArbitrumMahalendClaimableContractPositionFetcher } from './arbitrum/mahalend.claimable.contract-position-fetcher';
import { ArbitrumMahalendPositionPresenter } from './arbitrum/mahalend.position-presenter';
import { ArbitrumMahalendStableDebtTokenFetcher } from './arbitrum/mahalend.stable-debt.token-fetcher';
import { ArbitrumMahalendSupplyTokenFetcher } from './arbitrum/mahalend.supply.token-fetcher';
import { ArbitrumMahalendVariableDebtTokenFetcher } from './arbitrum/mahalend.variable-debt.token-fetcher';

@Module({
  providers: [
    MahalendContractFactory,
    // MahalendContractFactory,
    // EthereumMahalendClaimableContractPositionFetcher,
    EthereumMahalendPositionPresenter,
    EthereumMahalendStableDebtTokenFetcher,
    EthereumMahalendSupplyTokenFetcher,
    EthereumMahalendVariableDebtTokenFetcher,
    // ArbitrumMahalendClaimableContractPositionFetcher,
    ArbitrumMahalendPositionPresenter,
    ArbitrumMahalendStableDebtTokenFetcher,
    ArbitrumMahalendSupplyTokenFetcher,
    ArbitrumMahalendVariableDebtTokenFetcher,
  ],
})
export class MahalendAppModule extends AbstractApp() {}
