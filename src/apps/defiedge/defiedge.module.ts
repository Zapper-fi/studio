import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDefiedgeStrategyTokenFetcher } from './arbitrum/defiedge.strategy.token-fetcher';
import { DefiedgeStrategyDefinitionsResolver } from './common/defiedge.strategy.definitions-resolver';
import { DefiedgeContractFactory } from './contracts';
import { EthereumDefiedgeStrategyTokenFetcher } from './ethereum/defiedge.strategy.token-fetcher';
import { OPTIMISM_DEFIEDGE_PROVIDERS } from './optimism';
import { PolygonDefiedgeStrategyTokenFetcher } from './polygon/defiedge.strategy.token-fetcher';

@Module({
  providers: [
    DefiedgeContractFactory,
    DefiedgeStrategyDefinitionsResolver,
    ArbitrumDefiedgeStrategyTokenFetcher,
    EthereumDefiedgeStrategyTokenFetcher,
    PolygonDefiedgeStrategyTokenFetcher,
    ...OPTIMISM_DEFIEDGE_PROVIDERS,
  ],
})
export class DefiedgeAppModule extends AbstractApp() {}
