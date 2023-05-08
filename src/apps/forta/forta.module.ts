import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { FortaContractFactory } from './contracts';
import { EthereumFortaFORTTokenFetcher } from './ethereum/forta.FORT.token-fetcher';
import { PolygonFortaDsFORTContractPositionFetcher } from './polygon/forta.dsFORT.contract-position-fetcher';
import { PolygonFortaFORTTokenFetcher } from './polygon/forta.FORT.token-fetcher';

@Module({
  providers: [
    EthereumFortaFORTTokenFetcher,
    FortaContractFactory,
    PolygonFortaDsFORTContractPositionFetcher,
    PolygonFortaFORTTokenFetcher,
  ],
})
export class FortaAppModule extends AbstractApp() {}
