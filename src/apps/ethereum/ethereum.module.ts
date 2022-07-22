import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { RocketPoolAppModule } from '~apps/rocket-pool';

import { EthereumContractFactory } from './contracts';
import { ETHEREUM_DEFINITION, EthereumAppDefinition } from './ethereum.definition';
import { EthereumEthereumBalanceFetcher } from './ethereum/ethereum.balance-fetcher';
import { EthereumEthereumGenesisDepositContractPositionFetcher } from './ethereum/ethereum.genesis-deposit.contract-position-fetcher';

@Register.AppModule({
  appId: ETHEREUM_DEFINITION.id,
  imports: [RocketPoolAppModule],
  providers: [
    EthereumAppDefinition,
    EthereumContractFactory,
    EthereumEthereumGenesisDepositContractPositionFetcher,
    EthereumEthereumBalanceFetcher,
  ],
})
export class EthereumAppModule extends AbstractApp() {}
