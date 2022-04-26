import { Module } from '@nestjs/common';

import { AbstractApp, ExternalAppImport } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { ArbitrumYearnBalanceFetcher } from './arbitrum/yearn.balance-fetcher';
import { ArbitrumYearnVaultTokenFetcher } from './arbitrum/yearn.vault.token-fetcher';
import { YearnContractFactory } from './contracts';
import { EthereumYearnBalanceFetcher } from './ethereum/yearn.balance-fetcher';
import { EthereumYearnFarmContractPositionFetcher } from './ethereum/yearn.farm.contract-position-fetcher';
import { EthereumYearnVaultTokenFetcher } from './ethereum/yearn.vault.token-fetcher';
import { EthereumYearnYieldTokenFetcher } from './ethereum/yearn.yield.token-fetcher';
import { FantomYearnBalanceFetcher } from './fantom/yearn.balance-fetcher';
import { FantomYearnVaultTokenFetcher } from './fantom/yearn.vault.token-fetcher';
import { YearnLikeVaultTokenHelper } from './helpers/yearn-like.vault.token-helper';
import { YearnVaultTokenDefinitionsResolver } from './helpers/yearn.vault.token-definitions-resolver';
import { YearnVaultTokenHelper } from './helpers/yearn.vault.token-helper';
import { YearnAppDefinition } from './yearn.definition';

@Module({
  imports: ExternalAppImport(SynthetixAppModule),
  providers: [
    YearnAppDefinition,
    YearnContractFactory,
    YearnVaultTokenHelper,
    YearnLikeVaultTokenHelper,
    YearnVaultTokenDefinitionsResolver,
    EthereumYearnBalanceFetcher,
    EthereumYearnFarmContractPositionFetcher,
    EthereumYearnVaultTokenFetcher,
    EthereumYearnYieldTokenFetcher,
    FantomYearnBalanceFetcher,
    FantomYearnVaultTokenFetcher,
    ArbitrumYearnBalanceFetcher,
    ArbitrumYearnVaultTokenFetcher,
  ],
  exports: [YearnLikeVaultTokenHelper, YearnContractFactory],
})
export class YearnAppModule extends AbstractApp() {}
