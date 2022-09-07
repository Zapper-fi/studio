import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { EulerTokenDefinitionsResolver } from './common/euler.token-definition-resolver';
import { EulerContractFactory } from './contracts';
import { EthereumEulerDTokenTokenFetcher } from './ethereum/euler.d-token.token-fetcher';
import { EthereumEulerETokenTokenFetcher } from './ethereum/euler.e-token.token-fetcher';
import { EthereumEulerPTokenTokenFetcher } from './ethereum/euler.p-token.token-fetcher';
import { EulerAppDefinition, EULER_DEFINITION } from './euler.definition';

@Register.AppModule({
  appId: EULER_DEFINITION.id,
  providers: [
    EulerAppDefinition,
    EulerContractFactory,
    EulerTokenDefinitionsResolver,
    EthereumEulerDTokenTokenFetcher,
    EthereumEulerETokenTokenFetcher,
    EthereumEulerPTokenTokenFetcher,
  ],
})
export class EulerAppModule extends AbstractApp() {}
