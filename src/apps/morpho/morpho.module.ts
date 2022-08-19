import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { MorphoMarketsHelper } from '~apps/morpho/helpers/morpho.markets-helper';
import { MorphoCompoundSupplyContractPositionHelper } from '~apps/morpho/helpers/morpho.morpho-compound-supply.contract-position-helper';
import { MorphoRateHelper } from '~apps/morpho/helpers/morpho.rate-helper';

import { MorphoContractFactory } from './contracts';
import { EthereumMorphoCompoundSupplyContractPositionFetcher } from './ethereum/morpho.morpho-compound-supply.contract-position-fetcher';
import { MorphoAppDefinition, MORPHO_DEFINITION } from './morpho.definition';

@Register.AppModule({
  appId: MORPHO_DEFINITION.id,
  providers: [
    EthereumMorphoCompoundSupplyContractPositionFetcher,
    MorphoAppDefinition,
    MorphoCompoundSupplyContractPositionHelper,
    MorphoContractFactory,
    MorphoRateHelper,
    MorphoMarketsHelper,
  ],
  exports: [MorphoCompoundSupplyContractPositionHelper],
})
export class MorphoAppModule extends AbstractApp() {}
