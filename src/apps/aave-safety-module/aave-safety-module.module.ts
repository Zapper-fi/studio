import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AaveSafetyModuleViemContractFactory } from './contracts';
import { EthereumAaveSafetyModuleAbptTokenFetcher } from './ethereum/aave-safety-module.abpt.token-fetcher';
import { EthereumAaveSafetyModuleStkAaveClaimableContractPositionFetcher } from './ethereum/aave-safety-module.stk-aave-claimable.contract-position-fetcher';
import { EthereumAaveSafetyModuleStkAaveTokenFetcher } from './ethereum/aave-safety-module.stk-aave.token-fetcher';
import { EthereumAaveSafetyModuleStkAbptClaimableContractPositionFetcher } from './ethereum/aave-safety-module.stk-abpt-claimable.contract-position-fetcher';
import { EthereumAaveSafetyModuleStkAbptTokenFetcher } from './ethereum/aave-safety-module.stk-abpt.token-fetcher';

@Module({
  providers: [
    AaveSafetyModuleViemContractFactory,
    EthereumAaveSafetyModuleAbptTokenFetcher,
    EthereumAaveSafetyModuleStkAaveTokenFetcher,
    EthereumAaveSafetyModuleStkAaveClaimableContractPositionFetcher,
    EthereumAaveSafetyModuleStkAbptTokenFetcher,
    EthereumAaveSafetyModuleStkAbptClaimableContractPositionFetcher,
  ],
})
export class AaveSafetyModuleAppModule extends AbstractApp() {}
