import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AaveV2AppDefinition, AAVE_V2_DEFINITION } from './aave-v2.definition';
import { AvalancheAaveV2ClaimableContractPositionFetcher } from './avalanche/aave-v2.claimable.contract-position-fetcher';
import { AvalancheAaveV2PositionPresenter } from './avalanche/aave-v2.position-presenter';
import { AvalancheAaveV2StableDebtTokenFetcher } from './avalanche/aave-v2.stable-debt.token-fetcher';
import { AvalancheAaveV2SupplyTokenFetcher } from './avalanche/aave-v2.supply.token-fetcher';
import { AvalancheAaveV2VariableDebtTokenFetcher } from './avalanche/aave-v2.variable-debt.token-fetcher';
import { AaveV2ContractFactory } from './contracts';
import { EthereumAaveV2ClaimableContractPositionFetcher } from './ethereum/aave-v2.claimable.contract-position-fetcher';
import { EthereumAaveV2PositionPresenter } from './ethereum/aave-v2.position-presenter';
import { EthereumAaveV2StableDebtTokenFetcher } from './ethereum/aave-v2.stable-debt.token-fetcher';
import { EthereumAaveV2SupplyTokenFetcher } from './ethereum/aave-v2.supply.token-fetcher';
import { EthereumAaveV2VariableDebtTokenFetcher } from './ethereum/aave-v2.variable-debt.token-fetcher';
import { AaveV2ClaimableBalanceHelper } from './helpers/aave-v2.claimable.balance-helper';
import { AaveV2ClaimableContractPositionHelper } from './helpers/aave-v2.claimable.contract-position-helper';
import { PolygonAaveV2ClaimableContractPositionFetcher } from './polygon/aave-v2.claimable.contract-position-fetcher';
import { PolygonAaveV2PositionPresenter } from './polygon/aave-v2.position-presenter';
import { PolygonAaveV2StableDebtTokenFetcher } from './polygon/aave-v2.stable-debt.token-fetcher';
import { PolygonAaveV2SupplyTokenFetcher } from './polygon/aave-v2.supply.token-fetcher';
import { PolygonAaveV2VariableDebtTokenFetcher } from './polygon/aave-v2.variable-debt.token-fetcher';

@Register.AppModule({
  appId: AAVE_V2_DEFINITION.id,
  providers: [
    AaveV2AppDefinition,
    AaveV2ClaimableBalanceHelper,
    AaveV2ClaimableContractPositionHelper,
    AaveV2ContractFactory,
    AvalancheAaveV2ClaimableContractPositionFetcher,
    AvalancheAaveV2PositionPresenter,
    AvalancheAaveV2StableDebtTokenFetcher,
    AvalancheAaveV2SupplyTokenFetcher,
    AvalancheAaveV2VariableDebtTokenFetcher,
    EthereumAaveV2ClaimableContractPositionFetcher,
    EthereumAaveV2PositionPresenter,
    EthereumAaveV2StableDebtTokenFetcher,
    EthereumAaveV2SupplyTokenFetcher,
    EthereumAaveV2VariableDebtTokenFetcher,
    PolygonAaveV2ClaimableContractPositionFetcher,
    PolygonAaveV2PositionPresenter,
    PolygonAaveV2StableDebtTokenFetcher,
    PolygonAaveV2SupplyTokenFetcher,
    PolygonAaveV2VariableDebtTokenFetcher,
  ],
  exports: [AaveV2ClaimableBalanceHelper, AaveV2ClaimableContractPositionHelper, AaveV2ContractFactory],
})
export class AaveV2AppModule extends AbstractApp() {}
