import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { TokemakClaimableResolver } from './common/tokemak.claimable.resolver';
import { TokemakContractFactory } from './contracts';
import { EthereumTokemakClaimableContractPositionFetcher } from './ethereum/tokemak.claimable.contract-position-fetcher';
import { EthereumTokemakFarmContractPositionFetcher } from './ethereum/tokemak.farm.contract-position-fetcher';
import { EthereumTokemakReactorTokenFetcher } from './ethereum/tokemak.reactor.token-fetcher';
import { TokemakAppDefinition, TOKEMAK_DEFINITION } from './tokemak.definition';

@Register.AppModule({
  appId: TOKEMAK_DEFINITION.id,
  providers: [
    TokemakAppDefinition,
    TokemakContractFactory,
    TokemakClaimableResolver,
    EthereumTokemakReactorTokenFetcher,
    EthereumTokemakFarmContractPositionFetcher,
    EthereumTokemakClaimableContractPositionFetcher,
  ],
})
export class TokemakAppModule extends AbstractApp() {}
