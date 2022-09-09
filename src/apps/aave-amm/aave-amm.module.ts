import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { AaveV2ContractFactory } from '~apps/aave-v2';

import { AaveAmmAppDefinition, AAVE_AMM_DEFINITION } from './aave-amm.definition';
import { AaveAmmContractFactory } from './contracts';
import { EthereumAaveAmmPositionPresenter } from './ethereum/aave-amm.position-presenter';
import { EthereumAaveAmmStableDebtTokenFetcher } from './ethereum/aave-amm.stable-debt.token-fetcher';
import { EthereumAaveAmmSupplyTokenFetcher } from './ethereum/aave-amm.supply.token-fetcher';
import { EthereumAaveAmmVariableDebtTokenFetcher } from './ethereum/aave-amm.variable-debt.token-fetcher';

@Register.AppModule({
  appId: AAVE_AMM_DEFINITION.id,
  providers: [
    AaveAmmAppDefinition,
    AaveAmmContractFactory,
    AaveV2ContractFactory,
    EthereumAaveAmmPositionPresenter,
    EthereumAaveAmmStableDebtTokenFetcher,
    EthereumAaveAmmSupplyTokenFetcher,
    EthereumAaveAmmVariableDebtTokenFetcher,
  ],
})
export class AaveAmmAppModule extends AbstractApp() {}
