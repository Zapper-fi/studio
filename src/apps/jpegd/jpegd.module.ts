import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';
import { OlympusAppModule } from '~apps/olympus';

import { JpegdContractFactory } from './contracts';
import { EthereumJpegdBondContractPositionFetcher } from './ethereum/jpegd.bond.contract-position-fetcher';
import { EthereumJpegdPoolContractPositionFetcher } from './ethereum/jpegd.pool.contract-position-fetcher';
import { JpegdAppDefinition } from './jpegd.definition';

@Module({
  imports: [OlympusAppModule.externallyConfigured(OlympusAppModule, 0)],
  providers: [
    JpegdAppDefinition,
    JpegdContractFactory,
    EthereumJpegdPoolContractPositionFetcher,
    EthereumJpegdBondContractPositionFetcher,
  ],
})
export class JpegdAppModule extends AbstractDynamicApp<JpegdAppModule>() {}
