import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { StakefishContractFactory } from './contracts';
import { EthereumStakefishStakingContractPositionFetcher } from './ethereum/stakefish.staking.contract-position-fetcher';
import { StakefishAppDefinition, STAKEFISH_DEFINITION } from './stakefish.definition';

@Register.AppModule({
  appId: STAKEFISH_DEFINITION.id,
  providers: [EthereumStakefishStakingContractPositionFetcher, StakefishAppDefinition, StakefishContractFactory],
})
export class StakefishAppModule extends AbstractApp() {}
