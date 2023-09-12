import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumYearnVaultTokenFetcher } from './arbitrum/yearn.vault.token-fetcher';
import { YearnVaultTokenDefinitionsResolver } from './common/yearn.vault.token-definitions-resolver';
import { YearnContractFactory } from './contracts';
import { EthereumYearnGovernanceContractPositionFetcher } from './ethereum/yearn.governance.contract-position-fetcher';
import { EthereumYearnVaultTokenFetcher } from './ethereum/yearn.vault.token-fetcher';
import { EthereumYearnVeYfiContractPositionFetcher } from './ethereum/yearn.ve-yfi.contract-position-fetcher';
import { EthereumYearnYCrvTokenTokenFetcher } from './ethereum/yearn.y-crv.token-fetcher';
import { EthereumYearnYieldTokenFetcher } from './ethereum/yearn.yield.token-fetcher';
import { FantomYearnVaultTokenFetcher } from './fantom/yearn.vault.token-fetcher';
import { OptimismYearnSakingContractPositionFetcher } from './optimism/yearn.staking.contract-position-fetcher';
import { OptimismYearnVaultTokenFetcher } from './optimism/yearn.vault.token-fetcher';

@Module({
  providers: [
    YearnContractFactory,
    YearnVaultTokenDefinitionsResolver,
    // Arbitrum
    ArbitrumYearnVaultTokenFetcher,
    // Ethereum
    EthereumYearnVaultTokenFetcher,
    EthereumYearnGovernanceContractPositionFetcher,
    EthereumYearnYieldTokenFetcher,
    EthereumYearnYCrvTokenTokenFetcher,
    EthereumYearnVeYfiContractPositionFetcher,
    // Fantom
    FantomYearnVaultTokenFetcher,
    // Optimism
    OptimismYearnVaultTokenFetcher,
    OptimismYearnSakingContractPositionFetcher,
  ],
})
export class YearnAppModule extends AbstractApp() {}
