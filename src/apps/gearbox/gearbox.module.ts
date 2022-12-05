import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { GearboxContractFactory } from './contracts';
import { EthereumGearboxLendingTokenFetcher } from './ethereum/gearbox.lending.token-fetcher';
import { GearboxAppDefinition, GEARBOX_DEFINITION } from './gearbox.definition';

@Register.AppModule({
  appId: GEARBOX_DEFINITION.id,
  providers: [EthereumGearboxLendingTokenFetcher, GearboxAppDefinition, GearboxContractFactory],
})
export class GearboxAppModule extends AbstractApp() {}
