import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { IqContractFactory } from './contracts';
import { EthereumIqHiiqTokenFetcher } from './ethereum/iq.hiiq.token-fetcher';
import { IqAppDefinition, IQ_DEFINITION } from './iq.definition';

@Register.AppModule({
  appId: IQ_DEFINITION.id,
  providers: [EthereumIqHiiqTokenFetcher, IqAppDefinition, IqContractFactory],
})
export class IqAppModule extends AbstractApp() {}
