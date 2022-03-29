import { Module } from '@nestjs/common';

import { EthereumMyAppBalanceFetcher } from './ethereum/my-app.balance-fetcher';
import { EthereumMyAppPoolTokenFetcher } from './ethereum/my-app.pool.token-fetcher';
import { MyAppAppDefinition } from './my-app.definition';

@Module({
  providers: [MyAppAppDefinition, EthereumMyAppPoolTokenFetcher, EthereumMyAppBalanceFetcher],
})
export class MyAppAppModule {}
