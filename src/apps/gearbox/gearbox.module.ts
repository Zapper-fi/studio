import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { GearboxContractFactory } from './contracts';
import { EthereumGearboxCreditAccountsContractPositionFetcher } from './ethereum/gearbox.credit-accounts.contract-position-fetcher';
import { EthereumGearboxLendingTokenFetcher } from './ethereum/gearbox.lending.token-fetcher';
import { EthereumGearboxPhantomTokenFetcher } from './ethereum/gearbox.phantom.token-fetcher';
import { GearboxAppDefinition, GEARBOX_DEFINITION } from './gearbox.definition';

@Register.AppModule({
  appId: GEARBOX_DEFINITION.id,
  providers: [
    EthereumGearboxCreditAccountsContractPositionFetcher,
    EthereumGearboxLendingTokenFetcher,
    EthereumGearboxPhantomTokenFetcher,
    GearboxAppDefinition,
    GearboxContractFactory,
  ],
})
export class GearboxAppModule extends AbstractApp() {}
