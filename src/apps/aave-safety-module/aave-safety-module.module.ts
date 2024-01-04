import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AaveSafetyModuleViemContractFactory } from './contracts';
import { EthereumAaveSafetyModuleStkAaveClaimableContractPositionFetcher } from './ethereum/aave-safety-module.stk-aave-claimable.contract-position-fetcher';
import { EthereumAaveSafetyModuleStkAbptClaimableContractPositionFetcher } from './ethereum/aave-safety-module.stk-abpt-claimable.contract-position-fetcher';

@Module({
  providers: [
    AaveSafetyModuleViemContractFactory,
    EthereumAaveSafetyModuleStkAaveClaimableContractPositionFetcher,
    EthereumAaveSafetyModuleStkAbptClaimableContractPositionFetcher,
  ],
})
export class AaveSafetyModuleAppModule extends AbstractApp() {}
