import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { EaseContractFactory } from './contracts';
import { EaseAppDefinition } from './ease.definition';
import { EthereumEaseBalanceFetcher } from './ethereum/ease.balance-fetcher';
import { EthereumEaseRcaTokenFetcher } from './ethereum/ease.rca.token-fetcher';
import { EthereumEaseRcaTokenFetcher } from './ethereum/ease.rca.token-fetcher';

@Register.AppModule({
  appId: 'ease',
  providers: [
    EaseAppDefinition,
    EaseContractFactory,
    EthereumEaseBalanceFetcher,
    EthereumEaseRcaTokenFetcher,
    EthereumEaseRcaTokenFetcher,
  ],
})
export class EaseAppModule extends AbstractApp() {}
