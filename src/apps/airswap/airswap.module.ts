import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AirswapAppDefinition } from './airswap.definition';
import { AirswapContractFactory } from './contracts';
import { EthereumAirswapBalanceFetcher } from './ethereum/airswap.balance-fetcher';
import { EthereumAirswapSAstV2TokenFetcher } from './ethereum/airswap.s-ast-v2.token-fetcher';
import { EthereumAirswapSAstV3TokenFetcher } from './ethereum/airswap.s-ast-v3.token-fetcher';

@Module({
  providers: [
    AirswapAppDefinition,
    AirswapContractFactory,
    EthereumAirswapBalanceFetcher,
    EthereumAirswapSAstV2TokenFetcher,
    EthereumAirswapSAstV3TokenFetcher,
  ],
})
export class AirswapAppModule extends AbstractApp() {}
