import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AirswapAppDefinition } from './airswap.definition';
import { AirswapContractFactory } from './contracts';
import { EthereumAirswapBalanceFetcher } from './ethereum/airswap.balance-fetcher';
import { EthereumAirswapSAstTokenFetcher } from './ethereum/airswap.s-ast.token-fetcher';

@Module({
  providers: [
    AirswapAppDefinition,
    AirswapContractFactory,
    EthereumAirswapBalanceFetcher,
    EthereumAirswapSAstTokenFetcher,
  ],
})
export class AirswapAppModule extends AbstractApp() {}
