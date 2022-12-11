import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { IqContractFactory } from './contracts';
import { EthereumIqHiiqContractPositionFetcher } from './ethereum/iq.hiiq.contract-position-fetcher';
import { IqAppDefinition, IQ_DEFINITION } from './iq.definition';

@Register.AppModule({
  appId: IQ_DEFINITION.id,
  providers: [EthereumIqHiiqContractPositionFetcher, IqAppDefinition, IqContractFactory],
})
export class IqAppModule extends AbstractApp() {}
