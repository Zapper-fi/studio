import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { OriginDollarContractFactory } from './contracts';
import { EthereumOriginDollarBalanceFetcher } from './ethereum/origin-dollar.balance-fetcher';
import { EthereumOriginDollarRewardsContractPositionFetcher } from './ethereum/origin-dollar.rewards.contract-position-fetcher';
import { EthereumOriginDollarVeogvTokenFetcher } from './ethereum/origin-dollar.veogv.token-fetcher';
import { EthereumOriginDollarWousdTokenFetcher } from './ethereum/origin-dollar.wousd.token-fetcher';
import { OGVRewardsBalanceHelper } from './helpers/ogv-rewards.balance-helper';
import { OriginDollarAppDefinition, ORIGIN_DOLLAR_DEFINITION } from './origin-dollar.definition';

@Register.AppModule({
  appId: ORIGIN_DOLLAR_DEFINITION.id,
  providers: [
    EthereumOriginDollarBalanceFetcher,
    EthereumOriginDollarRewardsContractPositionFetcher,
    EthereumOriginDollarVeogvTokenFetcher,
    EthereumOriginDollarWousdTokenFetcher,
    OGVRewardsBalanceHelper,
    OriginDollarAppDefinition,
    OriginDollarContractFactory,
  ],
})
export class OriginDollarAppModule extends AbstractApp() {}
