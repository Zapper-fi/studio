import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { StargateFinanceContractFactory } from './contracts';
import { EthereumStargateFinanceBalanceFetcher } from './ethereum/stargate-finance.balance-fetcher';
import { EthereumStargateFinanceFarmContractPositionFetcher } from './ethereum/stargate-finance.farm.contract-position-fetcher';
import { EthereumStargateFinancePoolTokenFetcher } from './ethereum/stargate-finance.pool.token-fetcher';
import { EthereumStargateFinanceVeTokenFetcher } from './ethereum/stargate-finance.ve.token-fetcher';
import { StargateFinanceAppDefinition, STARGATE_FINANCE_DEFINITION } from './stargate-finance.definition';

@Register.AppModule({
  appId: STARGATE_FINANCE_DEFINITION.id,
  providers: [
    EthereumStargateFinanceBalanceFetcher,
    EthereumStargateFinanceFarmContractPositionFetcher,
    EthereumStargateFinancePoolTokenFetcher,
    EthereumStargateFinanceVeTokenFetcher,
    StargateFinanceAppDefinition,
    StargateFinanceContractFactory,
  ],
})
export class StargateFinanceAppModule extends AbstractApp() {}
