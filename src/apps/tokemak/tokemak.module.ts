import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { TokemakContractFactory } from './contracts';
import { EthereumTokemakBalanceFetcher } from './ethereum/tokemak.balance-fetcher';
import { EthereumTokemakFarmContractPositionFetcher } from './ethereum/tokemak.farm.contract-position-fetcher';
import { EthereumTokemakReactorTokenFetcher } from './ethereum/tokemak.reactor.token-fetcher';
import { TokemakAppDefinition } from './tokemak.definition';

@Module({
  imports: [SynthetixAppModule.externallyConfigured(SynthetixAppModule, 0)],
  providers: [
    TokemakAppDefinition,
    TokemakContractFactory,
    EthereumTokemakBalanceFetcher,
    EthereumTokemakReactorTokenFetcher,
    EthereumTokemakFarmContractPositionFetcher,
  ],
})
export class TokemakAppModule extends AbstractDynamicApp<TokemakAppModule>() {}
