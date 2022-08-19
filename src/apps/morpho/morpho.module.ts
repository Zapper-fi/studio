import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MorphoContractFactory } from './contracts';
import { EthereumMorphoMorphoCompoundSupplyTokenFetcher } from './ethereum/morpho.morpho-compound-supply.token-fetcher';
import { MorphoAppDefinition, MORPHO_DEFINITION } from './morpho.definition';

@Register.AppModule({
  appId: MORPHO_DEFINITION.id,
  providers: [EthereumMorphoMorphoCompoundSupplyTokenFetcher, MorphoAppDefinition, MorphoContractFactory],
})
export class MorphoAppModule extends AbstractApp() {}
