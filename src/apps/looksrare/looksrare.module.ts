import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { LooksrareContractFactory } from './contracts';
import { EthereumLooksrareAutocompoundingContractPositionFetcher } from './ethereum/looksrare.autocompounding.contract-position-fetcher';
import { EthereumLooksrareBalanceFetcher } from './ethereum/looksrare.balance-fetcher';
import { EthereumLooksrareStandardContractPositionFetcher } from './ethereum/looksrare.standard.contract-position-fetcher';
import { LooksrareAppDefinition, LOOKSRARE_DEFINITION } from './looksrare.definition';

@Register.AppModule({
  appId: LOOKSRARE_DEFINITION.id,
  providers: [
    EthereumLooksrareAutocompoundingContractPositionFetcher,
    EthereumLooksrareBalanceFetcher,
    EthereumLooksrareStandardContractPositionFetcher,
    LooksrareAppDefinition,
    LooksrareContractFactory,
  ],
})
export class LooksrareAppModule extends AbstractApp() {}
