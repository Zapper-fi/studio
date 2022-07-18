import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { NereusFinanceClaimableBalanceHelper } from '~apps/nereus-finance/helpers/nereus-finance.claimable.balance-helper';
import { NereusFinanceClaimableContractPositionHelper } from '~apps/nereus-finance/helpers/nereus-finance.claimable.contract-position-helper';
import { NereusFinanceLendingBalanceHelper } from '~apps/nereus-finance/helpers/nereus-finance.lending.balance-helper';
import { NereusFinanceLendingTokenHelper } from '~apps/nereus-finance/helpers/nereus-finance.lending.token-helper';

import { AvalancheNereusFinanceBalanceFetcher } from './avalanche/nereus-finance.balance-fetcher';
import { AvalancheNereusFinanceClaimableContractPositionFetcher } from './avalanche/nereus-finance.claimable.contract-position-fetcher';
import { AvalancheNereusFinanceStableDebtTokenFetcher } from './avalanche/nereus-finance.stable-debt.token-fetcher';
import { AvalancheNereusFinanceSupplyTokenFetcher } from './avalanche/nereus-finance.supply.token-fetcher';
import { NereusFinanceContractFactory } from './contracts';
import { NereusFinanceHealthFactorMetaHelper } from './helpers/nereus-finance.health-factor-meta-helper';
import { NereusFinanceAppDefinition, NEREUS_FINANCE_DEFINITION } from './nereus-finance.definition';

@Register.AppModule({
  appId: NEREUS_FINANCE_DEFINITION.id,
  providers: [
    AvalancheNereusFinanceBalanceFetcher,
    AvalancheNereusFinanceClaimableContractPositionFetcher,
    AvalancheNereusFinanceStableDebtTokenFetcher,
    AvalancheNereusFinanceSupplyTokenFetcher,
    NereusFinanceAppDefinition,
    NereusFinanceContractFactory,
    NereusFinanceLendingTokenHelper,
    NereusFinanceLendingBalanceHelper,
    NereusFinanceClaimableBalanceHelper,
    NereusFinanceHealthFactorMetaHelper,
    NereusFinanceClaimableContractPositionHelper,
  ],
})
export class NereusFinanceAppModule extends AbstractApp() {}
