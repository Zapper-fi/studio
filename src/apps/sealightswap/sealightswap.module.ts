import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SealightswapContractFactory } from './contracts';
import { PolygonSealightswapSealightswapTokenFetcher } from './polygon/sealightswap.sealightswap.token-fetcher';
import { SealightswapAppDefinition, SEALIGHTSWAP_DEFINITION } from './sealightswap.definition';

@Register.AppModule({
  appId: SEALIGHTSWAP_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [PolygonSealightswapSealightswapTokenFetcher, SealightswapAppDefinition, SealightswapContractFactory],
})
export class SealightswapAppModule extends AbstractApp() {}
