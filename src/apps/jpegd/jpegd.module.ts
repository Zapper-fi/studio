import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { JpegdViemContractFactory } from './contracts';
import { EthereumJpegdBondContractPositionFetcher } from './ethereum/jpegd.bond.contract-position-fetcher';
import { EthereumJpegdChefV1ContractPositionFetcher } from './ethereum/jpegd.chef-v1.contract-position-fetcher';
import { EthereumJpegdChefV2ContractPositionFetcher } from './ethereum/jpegd.chef-v2.contract-position-fetcher';

@Module({
  providers: [
    JpegdViemContractFactory,
    EthereumJpegdChefV1ContractPositionFetcher,
    EthereumJpegdChefV2ContractPositionFetcher,
    EthereumJpegdBondContractPositionFetcher,
  ],
})
export class JpegdAppModule extends AbstractApp() {}
