import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { EthereumMorphoAaveV3SupplyContractPositionFetcher } from '~apps/morpho/ethereum/morpho.morpho-aave-v3.contract-position-fetcher';

import { MorphoViemContractFactory } from './contracts';
import { EthereumMorphoAaveV2SupplyContractPositionFetcher } from './ethereum/morpho.morpho-aave-v2.contract-position-fetcher';
import { EthereumMorphoCompoundSupplyContractPositionFetcher } from './ethereum/morpho.morpho-compound.contract-position-fetcher';
import { EthereumMorphoPositionPresenter } from './ethereum/morpho.position-presenter';

@Module({
  providers: [
    MorphoViemContractFactory,
    // Ethereum
    EthereumMorphoCompoundSupplyContractPositionFetcher,
    EthereumMorphoAaveV2SupplyContractPositionFetcher,
    EthereumMorphoAaveV3SupplyContractPositionFetcher,
    EthereumMorphoPositionPresenter,
  ],
})
export class MorphoAppModule extends AbstractApp() {}
