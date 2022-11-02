import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { OriginDollarContractFactory } from './contracts';
import { EthereumOriginDollarRewardsContractPositionFetcher } from './ethereum/origin-dollar.rewards.contract-position-fetcher';
import { EthereumOriginDollarVeogvTokenFetcher } from './ethereum/origin-dollar.veogv.token-fetcher';
import { EthereumOriginDollarWousdTokenFetcher } from './ethereum/origin-dollar.wousd.token-fetcher';
import { OriginDollarAppDefinition, ORIGIN_DOLLAR_DEFINITION } from './origin-dollar.definition';

@Register.AppModule({
  appId: ORIGIN_DOLLAR_DEFINITION.id,
  providers: [
    OriginDollarAppDefinition,
    OriginDollarContractFactory,
    // Ethereum
    EthereumOriginDollarRewardsContractPositionFetcher,
    EthereumOriginDollarVeogvTokenFetcher,
    EthereumOriginDollarWousdTokenFetcher,
  ],
})
export class OriginDollarAppModule extends AbstractApp() {}
