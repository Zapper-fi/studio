import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { SynthetixAppModule } from '~apps/synthetix';

import { TokemakContractFactory } from './contracts';
import { EthereumTokemakBalanceFetcher } from './ethereum/tokemak.balance-fetcher';
import { EthereumTokemakFarmContractPositionFetcher } from './ethereum/tokemak.farm.contract-position-fetcher';
import { EthereumTokemakReactorTokenFetcher } from './ethereum/tokemak.reactor.token-fetcher';
import { EthereumTokemakTvlFetcher } from './ethereum/tokemak.tvl-fetcher';
import { TokemakAppDefinition, TOKEMAK_DEFINITION } from './tokemak.definition';

@Register.AppModule({
  appId: TOKEMAK_DEFINITION.id,
  imports: [SynthetixAppModule],
  providers: [
    TokemakAppDefinition,
    TokemakContractFactory,
    EthereumTokemakBalanceFetcher,
    EthereumTokemakReactorTokenFetcher,
    EthereumTokemakFarmContractPositionFetcher,
    EthereumTokemakTvlFetcher,
  ],
})
export class TokemakAppModule extends AbstractApp() {}
