import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { AaveV2AppDefinition, AAVE_V2_DEFINITION } from './aave-v2.definition';
import { AaveV2AppHelperModule } from './aave-v2.helper.module';
import { AvalancheAaveV2BalanceFetcher } from './avalanche/aave-v2.balance-fetcher';
import { AvalancheAaveV2ClaimableContractPositionFetcher } from './avalanche/aave-v2.claimable.contract-position-fetcher';
import { AvalancheAaveV2StableDebtTokenFetcher } from './avalanche/aave-v2.stable-debt.token-fetcher';
import { AvalancheAaveV2SupplyTokenFetcher } from './avalanche/aave-v2.supply.token-fetcher';
import { AvalancheAaveV2VariableDebtTokenFetcher } from './avalanche/aave-v2.variable-debt.token-fetcher';
import { EthereumAaveV2BalanceFetcher } from './ethereum/aave-v2.balance-fetcher';
import { EthereumAaveV2ClaimableContractPositionFetcher } from './ethereum/aave-v2.claimable.contract-position-fetcher';
import { EthereumAaveV2StableDebtTokenFetcher } from './ethereum/aave-v2.stable-debt.token-fetcher';
import { EthereumAaveV2SupplyTokenFetcher } from './ethereum/aave-v2.supply.token-fetcher';
import { EthereumAaveV2TvlFetcher } from './ethereum/aave-v2.tvl-fetcher';
import { EthereumAaveV2VariableDebtTokenFetcher } from './ethereum/aave-v2.variable-debt.token-fetcher';
import { PolygonAaveV2BalanceFetcher } from './polygon/aave-v2.balance-fetcher';
import { PolygonAaveV2ClaimableContractPositionFetcher } from './polygon/aave-v2.claimable.contract-position-fetcher';
import { PolygonAaveV2StableDebtTokenFetcher } from './polygon/aave-v2.stable-debt.token-fetcher';
import { PolygonAaveV2SupplyTokenFetcher } from './polygon/aave-v2.supply.token-fetcher';
import { PolygonAaveV2VariableDebtTokenFetcher } from './polygon/aave-v2.variable-debt.token-fetcher';

@Register.AppModule({
  appId: AAVE_V2_DEFINITION.id,
  imports: [AaveV2AppHelperModule],
  providers: [
    AaveV2AppDefinition,
    AvalancheAaveV2BalanceFetcher,
    AvalancheAaveV2ClaimableContractPositionFetcher,
    AvalancheAaveV2StableDebtTokenFetcher,
    AvalancheAaveV2SupplyTokenFetcher,
    AvalancheAaveV2VariableDebtTokenFetcher,
    EthereumAaveV2BalanceFetcher,
    EthereumAaveV2ClaimableContractPositionFetcher,
    EthereumAaveV2StableDebtTokenFetcher,
    EthereumAaveV2SupplyTokenFetcher,
    EthereumAaveV2TvlFetcher,
    EthereumAaveV2VariableDebtTokenFetcher,
    PolygonAaveV2BalanceFetcher,
    PolygonAaveV2ClaimableContractPositionFetcher,
    PolygonAaveV2StableDebtTokenFetcher,
    PolygonAaveV2SupplyTokenFetcher,
    PolygonAaveV2VariableDebtTokenFetcher,
  ],
})
export class AaveV2AppModule extends AbstractApp() {}
