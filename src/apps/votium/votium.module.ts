import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { VotiumContractFactory } from './contracts';
import { EthereumVotiumBalanceFetcher } from './ethereum/votium.balance-fetcher';
import { EthereumVotiumRewardsTokenFetcher } from './ethereum/votium.rewards.token-fetcher';
import { VotiumAppDefinition, VOTIUM_DEFINITION } from './votium.definition';
import { VotiumRewardsBalancesHelper } from './helpers/votium.rewards.balance-helper';

@Register.AppModule({
  appId: VOTIUM_DEFINITION.id,
  providers: [
    EthereumVotiumBalanceFetcher,
    EthereumVotiumRewardsTokenFetcher,
		VotiumRewardsBalancesHelper,
    VotiumAppDefinition,
    VotiumContractFactory,
  ],
})
export class VotiumAppModule extends AbstractApp() {}
