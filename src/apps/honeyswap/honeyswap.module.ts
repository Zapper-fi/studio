import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2/uniswap-v2.module';

import { HoneyswapContractFactory } from './contracts';
import { GnosisHoneyswapBalanceFetcher } from './gnosis/honeyswap.balance-fetcher';
import { GnosisHoneyswapPoolTokenFetcher } from './gnosis/honeyswap.pool.token-fetcher';
import { GnosisHoneyswapTvlFetcher } from './gnosis/honeyswap.tvl-fetcher';
import { HoneyswapAppDefinition, HONEYSWAP_DEFINITION } from './honeyswap.definition';
import { PolygonHoneyswapBalanceFetcher } from './polygon/honeyswap.balance-fetcher';
import { PolygonHoneyswapPoolTokenFetcher } from './polygon/honeyswap.pool.token-fetcher';
import { PolygonHoneyswapTvlFetcher } from './polygon/honeyswap.tvl-fetcher';

@Register.AppModule({
  appId: HONEYSWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    GnosisHoneyswapBalanceFetcher,
    GnosisHoneyswapPoolTokenFetcher,
    GnosisHoneyswapTvlFetcher,
    HoneyswapAppDefinition,
    HoneyswapContractFactory,
    PolygonHoneyswapBalanceFetcher,
    PolygonHoneyswapPoolTokenFetcher,
    PolygonHoneyswapTvlFetcher,
  ],
})
export class HoneyswapAppModule extends AbstractApp() {}
