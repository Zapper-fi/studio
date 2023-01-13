import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV3ContractFactory } from '~apps/uniswap-v3/contracts';

import { KeeperContractFactory } from './contracts';
import { EthereumKeeperBondContractPositionFetcher } from './ethereum/keeper.bond.contract-position-fetcher';
import { EthereumKeeperJobContractPositionFetcher } from './ethereum/keeper.job.contract-position-fetcher';
import { EthereumKeeperKlpTokenFetcher } from './ethereum/keeper.klp.token-fetcher';
import { EthereumKeeperRedeemableTokenFetcher } from './ethereum/keeper.redeemable.token-fetcher';
import { EthereumKeeperUnbondContractPositionFetcher } from './ethereum/keeper.unbond.contract-position-fetcher';
import { EthereumKeeperVestContractPositionFetcher } from './ethereum/keeper.vest.contract-position-fetcher';

@Module({
  providers: [
    KeeperContractFactory,
    UniswapV3ContractFactory,
    EthereumKeeperUnbondContractPositionFetcher,
    EthereumKeeperBondContractPositionFetcher,
    EthereumKeeperJobContractPositionFetcher,
    EthereumKeeperKlpTokenFetcher,
    EthereumKeeperRedeemableTokenFetcher,
    EthereumKeeperVestContractPositionFetcher,
  ],
})
export class KeeperAppModule extends AbstractApp() {}
