import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AaveSafetyModuleAppDefinition, AAVE_SAFETY_MODULE_DEFINITION } from './aave-safety-module.definition';
import { AaveSafetyModuleContractFactory } from './contracts';
import { EthereumAaveSafetyModuleAbptTokenFetcher } from './ethereum/aave-safety-module.abpt.token-fetcher';
import { EthereumAaveSafetyModuleStkAaveClaimableContractPositionFetcher } from './ethereum/aave-safety-module.stk-aave-claimable.contract-position-fetcher';
import { EthereumAaveSafetyModuleStkAaveTokenFetcher } from './ethereum/aave-safety-module.stk-aave.token-fetcher';
import { EthereumAaveSafetyModuleStkAbptClaimableContractPositionFetcher } from './ethereum/aave-safety-module.stk-abpt-claimable.contract-position-fetcher';
import { EthereumAaveSafetyModuleStkAbptTokenFetcher } from './ethereum/aave-safety-module.stk-abpt.token-fetcher';

@Register.AppModule({
  appId: AAVE_SAFETY_MODULE_DEFINITION.id,
  providers: [
    AaveSafetyModuleAppDefinition,
    AaveSafetyModuleContractFactory,
    EthereumAaveSafetyModuleAbptTokenFetcher,
    EthereumAaveSafetyModuleStkAaveTokenFetcher,
    EthereumAaveSafetyModuleStkAaveClaimableContractPositionFetcher,
    EthereumAaveSafetyModuleStkAbptTokenFetcher,
    EthereumAaveSafetyModuleStkAbptClaimableContractPositionFetcher,
  ],
})
export class AaveSafetyModuleAppModule extends AbstractApp() {}
