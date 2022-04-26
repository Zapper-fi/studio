import { Module } from '@nestjs/common';

import { AbstractApp, ExternalAppImport } from '~app/app.dynamic-module';
import { OlympusAppModule } from '~apps/olympus';

import { JpegdContractFactory } from './contracts';
import { EthereumJpegdBalanceFetcher } from './ethereum/jpegd.balance-fetcher';
import { EthereumJpegdBondContractPositionFetcher } from './ethereum/jpegd.bond.contract-position-fetcher';
import { EthereumJpegdPoolContractPositionFetcher } from './ethereum/jpegd.pool.contract-position-fetcher';
import { JpegdAppDefinition } from './jpegd.definition';

@Module({
  imports: ExternalAppImport(OlympusAppModule),
  providers: [
    JpegdAppDefinition,
    JpegdContractFactory,
    EthereumJpegdBalanceFetcher,
    EthereumJpegdPoolContractPositionFetcher,
    EthereumJpegdBondContractPositionFetcher,
  ],
})
export class JpegdAppModule extends AbstractApp() {}
