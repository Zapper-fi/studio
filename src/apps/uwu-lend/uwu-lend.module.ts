import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UwuLendContractFactory } from './contracts';
import { EthereumUwuLendPlatformFeesV1PositionFetcher } from './ethereum/uwu-lend.platform-fees-v1.contract-position-fetcher';
import { EthereumUwuLendPlatformFeesV2PositionFetcher } from './ethereum/uwu-lend.platform-fees-v2.contract-position-fetcher';
import { EthereumUwuLendSupplyTokenFetcher } from './ethereum/uwu-lend.supply.token-fetcher';
import { EthereumUwuLendVariableDebtTokenFetcher } from './ethereum/uwu-lend.variable-debt.token-fetcher';

@Module({
  providers: [
    UwuLendContractFactory,
    EthereumUwuLendSupplyTokenFetcher,
    EthereumUwuLendVariableDebtTokenFetcher,
    EthereumUwuLendPlatformFeesV1PositionFetcher,
    EthereumUwuLendPlatformFeesV2PositionFetcher,
  ],
})
export class UwuLendAppModule extends AbstractApp() {}
