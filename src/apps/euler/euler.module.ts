import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { EulerContractFactory } from './contracts';
import { EthereumEulerBalanceFetcher } from './ethereum/euler.balance-fetcher';
import { EthereumEulerDTokenTokenFetcher } from './ethereum/euler.d-token.token-fetcher';
import { EthereumEulerETokenTokenFetcher } from './ethereum/euler.e-token.token-fetcher';
import { EthereumEulerPTokenTokenFetcher } from './ethereum/euler.p-token.token-fetcher';
import { EthereumEulerTvlFetcher } from './ethereum/euler.tvl-fetcher';
import { EulerAppDefinition, EULER_DEFINITION } from './euler.definition';

@Register.AppModule({
  appId: EULER_DEFINITION.id,
  providers: [
    EthereumEulerBalanceFetcher,
    EthereumEulerDTokenTokenFetcher,
    EthereumEulerETokenTokenFetcher,
    EthereumEulerPTokenTokenFetcher,
    EthereumEulerTvlFetcher,
    EulerAppDefinition,
    EulerContractFactory,
  ],
})
export class EulerAppModule extends AbstractApp() {}
