import { Module } from '@nestjs/common';

import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2';

import { AaveAmmAppDefinition } from './aave-amm.definition';
import { AaveAmmContractFactory } from './contracts';
import { EthereumAaveAmmPositionPresenter } from './ethereum/aave-amm.position-presenter';
import { EthereumAaveAmmStableDebtTokenFetcher } from './ethereum/aave-amm.stable-debt.token-fetcher';
import { EthereumAaveAmmSupplyTokenFetcher } from './ethereum/aave-amm.supply.token-fetcher';
import { EthereumAaveAmmVariableDebtTokenFetcher } from './ethereum/aave-amm.variable-debt.token-fetcher';

@Module({
  providers: [
    AaveAmmAppDefinition,
    AaveAmmContractFactory,
    AaveV2ContractFactory,
    EthereumAaveAmmPositionPresenter,
    EthereumAaveAmmStableDebtTokenFetcher,
    EthereumAaveAmmSupplyTokenFetcher,
    EthereumAaveAmmVariableDebtTokenFetcher,
  ],
  exports: [AaveAmmAppDefinition, AaveAmmContractFactory],
})
export class AaveAmmAppModule extends AbstractApp() {}
