import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AaveSafetyModuleAppDefinition, AAVE_SAFETY_MODULE_DEFINITION } from './aave-safety-module.definition';
import { AaveSafetyModuleContractFactory } from './contracts';
import { EthereumAaveSafetyModuleAbptTokenFetcher } from './ethereum/aave-safety-module.abpt.token-fetcher';
import { EthereumAaveSafetyModuleBalanceFetcher } from './ethereum/aave-safety-module.balance-fetcher';
import { EthereumAaveSafetyModuleStkAaveTokenFetcher } from './ethereum/aave-safety-module.stk-aave.token-fetcher';
import { EthereumAaveSafetyModuleStkAbptTokenFetcher } from './ethereum/aave-safety-module.stk-abpt.token-fetcher';
import { AaveSafetyModuleClaimableBalanceHelper } from './helpers/aave-safety-module.claimable.balance-helper';

@Register.AppModule({
  appId: AAVE_SAFETY_MODULE_DEFINITION.id,
  providers: [
    AaveSafetyModuleAppDefinition,
    AaveSafetyModuleContractFactory,
    AaveSafetyModuleClaimableBalanceHelper,
    EthereumAaveSafetyModuleAbptTokenFetcher,
    EthereumAaveSafetyModuleBalanceFetcher,
    EthereumAaveSafetyModuleStkAaveTokenFetcher,
    EthereumAaveSafetyModuleStkAbptTokenFetcher,
  ],
})
export class AaveSafetyModuleAppModule extends AbstractApp() {}
