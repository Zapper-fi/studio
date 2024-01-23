import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { ArbitrumOlympusGOhmTokenFetcher } from './arbitrum/olympus.g-ohm.token-fetcher';
import { ArbitrumOlympusWsOhmV1TokenFetcher } from './arbitrum/olympus.ws-ohm-v1.token-fetcher';
import { AvalancheOlympusGOhmTokenFetcher } from './avalanche/olympus.g-ohm.token-fetcher';
import { AvalancheOlympusWsOhmV1TokenFetcher } from './avalanche/olympus.ws-ohm-v1.token-fetcher';
import { OlympusViemContractFactory } from './contracts';
import { EthereumOlympusBondContractPositionFetcher } from './ethereum/olympus.bond.contract-position-fetcher';
import { EthereumOlympusBleContractPositionFetcher } from './ethereum/olympus.boosted-liquidity.contract-position-fetcher';
import { FantomOlympusGOhmTokenFetcher } from './fantom/olympus.g-ohm.token-fetcher';
import { PolygonOlympusGOhmTokenFetcher } from './polygon/olympus.g-ohm.token-fetcher';

@Module({
  providers: [
    ArbitrumOlympusGOhmTokenFetcher,
    ArbitrumOlympusWsOhmV1TokenFetcher,
    AvalancheOlympusGOhmTokenFetcher,
    AvalancheOlympusWsOhmV1TokenFetcher,
    EthereumOlympusBleContractPositionFetcher,
    EthereumOlympusBondContractPositionFetcher,
    FantomOlympusGOhmTokenFetcher,
    OlympusViemContractFactory,
    PolygonOlympusGOhmTokenFetcher,
  ],
})
export class OlympusAppModule extends AbstractApp() {}
