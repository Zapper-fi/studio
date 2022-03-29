import { Module } from '@nestjs/common';

import { EthereumMyAppPoolTokenFetcher } from './ethereum/my-app.pool.token-fetcher';
import { MyAppAppDefinition } from './my-app.definition';

@Module({
  providers: [MyAppAppDefinition, EthereumMyAppPoolTokenFetcher],
})
export class MyAppAppModule {}
