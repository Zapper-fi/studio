import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { BinanceSmartChainHectorNetworkBondNoTreasuryContractPositionFetcher } from './binance-smart-chain/hector-network.bond-no-treasury.contract-position-fetcher';
import { HectorNetworkViemContractFactory } from './contracts';
import { FantomHectorNetworkBondNoTreasuryContractPositionFetcher } from './fantom/hector-network.bond-no-treasury.contract-position-fetcher';
import { FantomHectorNetworkBondContractPositionFetcher } from './fantom/hector-network.bond.contract-position-fetcher';
import { FantomHectorNetworkFarmContractPositionFetcher } from './fantom/hector-network.farm.contract-position-fetcher';
import { FantomHectorNetworkStakeBondContractPositionFetcher } from './fantom/hector-network.stake-bond.contract-position-fetcher';

@Module({
  providers: [
    BinanceSmartChainHectorNetworkBondNoTreasuryContractPositionFetcher,
    FantomHectorNetworkBondContractPositionFetcher,
    FantomHectorNetworkBondNoTreasuryContractPositionFetcher,
    FantomHectorNetworkFarmContractPositionFetcher,
    FantomHectorNetworkStakeBondContractPositionFetcher,

    HectorNetworkViemContractFactory,
  ],
})
export class HectorNetworkAppModule extends AbstractApp() {}
