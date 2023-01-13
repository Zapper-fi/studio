import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EthereumEulerPositionPresenter } from './common/euler.position-presenter';
import { EulerTokenDefinitionsResolver } from './common/euler.token-definition-resolver';
import { EulerContractFactory } from './contracts';
import { EthereumEulerDTokenTokenFetcher } from './ethereum/euler.d-token.token-fetcher';
import { EthereumEulerETokenTokenFetcher } from './ethereum/euler.e-token.token-fetcher';
import { EthereumEulerPTokenTokenFetcher } from './ethereum/euler.p-token.token-fetcher';
import { EulerAppDefinition } from './euler.definition';

@Module({
  providers: [
    EulerContractFactory,
    EulerTokenDefinitionsResolver,
    EthereumEulerPositionPresenter,
    EthereumEulerDTokenTokenFetcher,
    EthereumEulerETokenTokenFetcher,
    EthereumEulerPTokenTokenFetcher,
  ],
})
export class EulerAppModule extends AbstractApp() {}
