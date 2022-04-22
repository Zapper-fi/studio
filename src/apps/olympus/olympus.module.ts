import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { OlympusContractFactory } from './contracts';
import { EthereumOlympusBalanceFetcher } from './ethereum/olympus.balance-fetcher';
import { EthereumOlympusBondsContractPositionFetcher } from './ethereum/olympus.bonds.contract-position-fetcher';
import { OlympusAppDefinition } from './olympus.definition';

@Module({
  providers: [
    OlympusAppDefinition,
    OlympusContractFactory,
    EthereumOlympusBalanceFetcher,
    EthereumOlympusBondsContractPositionFetcher,
  ],
})
export class OlympusAppModule extends AbstractDynamicApp<OlympusAppModule>() {}
