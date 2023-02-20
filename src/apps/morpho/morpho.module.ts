import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { MorphoContractFactory } from './contracts';
import { EthereumMorphoAaveV2SupplyContractPositionFetcher } from './ethereum/morpho.morpho-aave-v2.contract-position-fetcher';
import { EthereumMorphoCompoundSupplyContractPositionFetcher } from './ethereum/morpho.morpho-compound.contract-position-fetcher';
import { EthereumMorphoPositionPresenter } from './ethereum/morpho.position-presenter';

@Module({
  providers: [
    MorphoContractFactory,
    // Ethereum
    EthereumMorphoCompoundSupplyContractPositionFetcher,
    EthereumMorphoAaveV2SupplyContractPositionFetcher,
    EthereumMorphoPositionPresenter,
  ],
})
export class MorphoAppModule extends AbstractApp() {}
