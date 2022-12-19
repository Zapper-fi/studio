import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumDefiedgeStrategyTokenFetcher } from './arbitrum/defiedge.strategy.token-fetcher';
import { DefiEdgeStrategyDefinitionsResolver } from './common/defiedge.strategy.definitions-resolver';
import { DefiedgeContractFactory } from './contracts';
import { DefiedgeAppDefinition, DEFIEDGE_DEFINITION } from './defiedge.definition';
import { EthereumDefiedgeStrategyTokenFetcher } from './ethereum/defiedge.strategy.token-fetcher';
import { OptimismDefiedgeStrategyTokenFetcher } from './optimism/defiedge.strategy.token-fetcher';
import { PolygonDefiedgeStrategyTokenFetcher } from './polygon/defiedge.strategy.token-fetcher';

@Register.AppModule({
  appId: DEFIEDGE_DEFINITION.id,
  providers: [
    DefiedgeAppDefinition,
    DefiedgeContractFactory,
    DefiEdgeStrategyDefinitionsResolver,
    ArbitrumDefiedgeStrategyTokenFetcher,
    EthereumDefiedgeStrategyTokenFetcher,
    OptimismDefiedgeStrategyTokenFetcher,
    PolygonDefiedgeStrategyTokenFetcher,
  ],
})
export class DefiedgeAppModule extends AbstractApp() {}
