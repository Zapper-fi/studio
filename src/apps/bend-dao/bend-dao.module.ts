import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2/contracts';

import { BendDaoContractFactory } from './contracts';
import { EthereumBendDaoPositionPresenter } from './ethereum/bend-dao.position-presenter';
import { EthereumBendDaoSupplyTokenFetcher } from './ethereum/bend-dao.supply.token-fetcher';
import { EthereumBendDaoVariableDebtTokenFetcher } from './ethereum/bend-dao.variable-debt.token-fetcher';

@Module({
  providers: [
    BendDaoContractFactory,
    AaveV2ContractFactory,
    EthereumBendDaoVariableDebtTokenFetcher,
    EthereumBendDaoSupplyTokenFetcher,
    EthereumBendDaoPositionPresenter,
  ],
})
export class BendDaoAppModule extends AbstractApp() {}
