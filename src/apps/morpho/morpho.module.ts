import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { EthereumMorphoBlueSupplyContractPositionFetcher } from '~apps/morpho/ethereum/morpho.morpho-blue.contract-position-fetcher';
import { EthereumMorphoAaveV3SupplyContractPositionFetcher } from '~apps/morpho/ethereum/morpho.morpho-aave-v3.contract-position-fetcher';
import { EthereumMorphoAaveV2SupplyContractPositionFetcher } from '~apps/morpho/ethereum/morpho.morpho-aave-v2.contract-position-fetcher';
import { EthereumMorphoCompoundSupplyContractPositionFetcher } from '~apps/morpho/ethereum/morpho.morpho-compound.contract-position-fetcher';
import { EthereumMorphoPositionPresenter } from '~apps/morpho/ethereum/morpho.position-presenter';

import { MorphoViemContractFactory } from './contracts';

@Module({
  providers: [
    MorphoViemContractFactory,
    // Ethereum
    EthereumMorphoCompoundSupplyContractPositionFetcher,
    EthereumMorphoAaveV2SupplyContractPositionFetcher,
    EthereumMorphoAaveV3SupplyContractPositionFetcher,
    EthereumMorphoBlueSupplyContractPositionFetcher,
    EthereumMorphoPositionPresenter,
  ],
})
export class MorphoAppModule extends AbstractApp() {}
