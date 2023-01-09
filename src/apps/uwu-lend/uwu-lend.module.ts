import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UwuLendContractFactory } from './contracts';
import { EthereumUwuLendLpStakingV1ContractPositionFetcher } from './ethereum/uwu-lend.lp-staking-v1.contract-position-fetcher';
import { EthereumUwuLendLpStakingV2ContractPositionFetcher } from './ethereum/uwu-lend.lp-staking-v2.contract-position-fetcher';
import { EthereumUwuLendSupplyTokenFetcher } from './ethereum/uwu-lend.supply.token-fetcher';
import { EthereumUwuLendVariableDebtTokenFetcher } from './ethereum/uwu-lend.variable-debt.token-fetcher';
import { EthereumUwuLendVestingV1ContractPositionFetcher } from './ethereum/uwu-lend.vesting-v1.contract-position-fetcher';
import { EthereumUwuLendVestingV2ContractPositionFetcher } from './ethereum/uwu-lend.vesting-v2.contract-position-fetcher';
import { UwuLendAppDefinition } from './uwu-lend.definition';

@Module({
  providers: [
    UwuLendAppDefinition,
    UwuLendContractFactory,
    EthereumUwuLendSupplyTokenFetcher,
    EthereumUwuLendVariableDebtTokenFetcher,
    EthereumUwuLendLpStakingV1ContractPositionFetcher,
    EthereumUwuLendLpStakingV2ContractPositionFetcher,
    EthereumUwuLendVestingV1ContractPositionFetcher,
    EthereumUwuLendVestingV2ContractPositionFetcher,
  ],
})
export class UwuLendAppModule extends AbstractApp() {}
