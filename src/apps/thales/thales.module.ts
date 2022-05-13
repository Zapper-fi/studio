import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { ThalesContractFactory } from './contracts';
import { OptimismThalesBalanceFetcher } from './optimism/thales.balance-fetcher';
import { OptimismThalesEscrowContractPositionFetcher } from './optimism/thales.escrow.contract-position-fetcher';
import { OptimismThalesPool2ContractPositionFetcher } from './optimism/thales.pool2.contract-position-fetcher';
import { OptimismThalesStakingContractPositionFetcher } from './optimism/thales.staking.contract-position-fetcher';
import { ThalesAppDefinition, THALES_DEFINITION } from './thales.definition';

@Register.AppModule({
  appId: THALES_DEFINITION.id,
  providers: [
    ThalesAppDefinition,
    ThalesContractFactory,
    OptimismThalesBalanceFetcher,
    OptimismThalesStakingContractPositionFetcher,
    OptimismThalesEscrowContractPositionFetcher,
    OptimismThalesPool2ContractPositionFetcher,
  ],
})
export class ThalesAppModule extends AbstractApp() { }
