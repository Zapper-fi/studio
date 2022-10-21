import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { EthereumStakingContractFactory } from './contracts';
import { ETHEREUM_STAKING_DEFINITION, EthereumStakingAppDefinition } from './ethereum-staking.definition';
import { EthereumEthereumStakingDepositContractPositionFetcher } from './ethereum/ethereum-staking.deposit.contract-position-fetcher';

@Register.AppModule({
  appId: ETHEREUM_STAKING_DEFINITION.id,
  providers: [
    EthereumStakingAppDefinition,
    EthereumStakingContractFactory,
    EthereumEthereumStakingDepositContractPositionFetcher,
  ],
})
export class EthereumStakingAppModule extends AbstractApp() {}
