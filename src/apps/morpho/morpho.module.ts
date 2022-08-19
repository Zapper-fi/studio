import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { MorphoBalanceHelper } from '~apps/morpho/helpers/morpho.balance-helper';
import { MorphoCompoundLendingMetaHelper } from '~apps/morpho/helpers/morpho.compound-lending.meta-helper';
import { MorphoMarketsHelper } from '~apps/morpho/helpers/morpho.markets-helper';
import { MorphoCompoundContractPositionHelper } from '~apps/morpho/helpers/morpho.morpho-compound.contract-position-helper';
import { MorphoRateHelper } from '~apps/morpho/helpers/morpho.rate-helper';

import { MorphoContractFactory } from './contracts';
import { EthereumMorphoBalanceFetcher } from './ethereum/morpho.balance-fetcher';
import { EthereumMorphoCompoundSupplyContractPositionFetcher } from './ethereum/morpho.morpho-compound.contract-position-fetcher';
import { MorphoAppDefinition, MORPHO_DEFINITION } from './morpho.definition';

@Register.AppModule({
  appId: MORPHO_DEFINITION.id,
  providers: [
    EthereumMorphoBalanceFetcher,
    EthereumMorphoCompoundSupplyContractPositionFetcher,
    MorphoAppDefinition,
    MorphoCompoundContractPositionHelper,
    MorphoContractFactory,
    MorphoMarketsHelper,
    MorphoRateHelper,
    MorphoCompoundLendingMetaHelper,
    MorphoBalanceHelper,
  ],
  exports: [MorphoCompoundContractPositionHelper],
})
export class MorphoAppModule extends AbstractApp() {}
