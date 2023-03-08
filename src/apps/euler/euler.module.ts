import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { EulerApiStakingRegistry } from '~apps/euler/common/euler.api.staking-registry';

import { EulerTokenDefinitionsResolver } from './common/euler.token-definition-resolver';
import { EulerContractFactory } from './contracts';
import { EthereumEulerDTokenTokenFetcher } from './ethereum/euler.d-token.token-fetcher';
import { EthereumEulerETokenTokenFetcher } from './ethereum/euler.e-token.token-fetcher';
import { EthereumEulerPTokenTokenFetcher } from './ethereum/euler.p-token.token-fetcher';
import { EthereumEulerPositionPresenter } from './ethereum/euler.position-presenter';
import { EthereumEulerSingleStakingFarmContractPositionFetcher } from './ethereum/euler.single-staking-farm.contract-position-fetcher';

@Module({
  providers: [
    EthereumEulerDTokenTokenFetcher,
    EthereumEulerETokenTokenFetcher,
    EthereumEulerPTokenTokenFetcher,
    EthereumEulerPositionPresenter,
    EthereumEulerSingleStakingFarmContractPositionFetcher,
    EulerContractFactory,
    EulerTokenDefinitionsResolver,
    EulerApiStakingRegistry,
  ],
})
export class EulerAppModule extends AbstractApp() {}
