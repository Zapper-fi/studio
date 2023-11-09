import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';

import { UwuLendViemContractFactory } from './contracts';
import { EthereumUwuLendPlatformFeesV1PositionFetcher } from './ethereum/uwu-lend.platform-fees-v1.contract-position-fetcher';
import { EthereumUwuLendPlatformFeesV2PositionFetcher } from './ethereum/uwu-lend.platform-fees-v2.contract-position-fetcher';
import { EthereumUwuLendPositionPresenter } from './ethereum/uwu-lend.position-presenter';
import { EthereumUwuLendSupplyTokenFetcher } from './ethereum/uwu-lend.supply.token-fetcher';
import { EthereumUwuLendVariableDebtTokenFetcher } from './ethereum/uwu-lend.variable-debt.token-fetcher';

@Module({
  providers: [
    UwuLendViemContractFactory,
    EthereumUwuLendSupplyTokenFetcher,
    EthereumUwuLendVariableDebtTokenFetcher,
    EthereumUwuLendPlatformFeesV1PositionFetcher,
    EthereumUwuLendPlatformFeesV2PositionFetcher,
    EthereumUwuLendPositionPresenter,
  ],
})
export class UwuLendAppModule extends AbstractApp() {}
