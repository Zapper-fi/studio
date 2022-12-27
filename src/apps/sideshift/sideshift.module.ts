import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { SideshiftContractFactory } from './contracts';
import { EthereumSideshiftSvxaiTokenFetcher } from './ethereum/sideshift.svxai.token-fetcher';
import { SideshiftAppDefinition, SIDESHIFT_DEFINITION } from './sideshift.definition';

@Register.AppModule({
  appId: SIDESHIFT_DEFINITION.id,
  providers: [EthereumSideshiftSvxaiTokenFetcher, SideshiftAppDefinition, SideshiftContractFactory],
})
export class SideshiftAppModule extends AbstractApp() {}
