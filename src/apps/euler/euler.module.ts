import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { EulerTokenDefinitionsResolver } from './common/euler.token-definition-resolver';
import { EulerContractFactory } from './contracts';
import { EthereumEulerDTokenTokenFetcher } from './ethereum/euler.d-token.token-fetcher';
import { EthereumEulerETokenTokenFetcher } from './ethereum/euler.e-token.token-fetcher';
import { EthereumEulerPTokenTokenFetcher } from './ethereum/euler.p-token.token-fetcher';
import { EthereumEulerPositionPresenter } from './ethereum/euler.position-presenter';

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
