import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { MorphoContractFactory } from './contracts';
import { EthereumMorphoCompoundSupplyContractPositionFetcher } from './ethereum/morpho.morpho-compound.contract-position-fetcher';
import { EthereumMorphoPositionPresenter } from './ethereum/morpho.position-presenter';
import { MorphoAppDefinition, MORPHO_DEFINITION } from './morpho.definition';

@Register.AppModule({
  appId: MORPHO_DEFINITION.id,
  providers: [
    MorphoAppDefinition,
    MorphoContractFactory,
    // Ethereum
    EthereumMorphoCompoundSupplyContractPositionFetcher,
    EthereumMorphoPositionPresenter,
  ],
})
export class MorphoAppModule extends AbstractApp() {}
