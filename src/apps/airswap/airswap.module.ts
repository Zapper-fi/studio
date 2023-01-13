import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { AirswapAppDefinition } from './airswap.definition';
import { AirswapContractFactory } from './contracts';
import { EthereumAirswapSAstV2TokenFetcher } from './ethereum/airswap.s-ast-v2.token-fetcher';
import { EthereumAirswapSAstV3TokenFetcher } from './ethereum/airswap.s-ast-v3.token-fetcher';

@Module({
  providers: [AirswapContractFactory, EthereumAirswapSAstV2TokenFetcher, EthereumAirswapSAstV3TokenFetcher],
})
export class AirswapAppModule extends AbstractApp() {}
