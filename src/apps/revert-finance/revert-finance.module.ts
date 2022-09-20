import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';
import { UniswapV3LiquidityTokenHelper } from '~apps/uniswap-v2/helpers/uniswap-v3.liquidity.token-helper';

import { ArbitrumRevertFinanceBalanceFetcher } from './arbitrum/revert-finance.balance-fetcher';
import { RevertFinanceContractFactory } from './contracts';
import { EthereumRevertFinanceBalanceFetcher } from './ethereum/revert-finance.balance-fetcher';
import { OptimismRevertFinanceBalanceFetcher } from './optimism/revert-finance.balance-fetcher';
import { PolygonRevertFinanceBalanceFetcher } from './polygon/revert-finance.balance-fetcher';
import { RevertFinanceAppDefinition, REVERT_FINANCE_DEFINITION } from './revert-finance.definition';

@Register.AppModule({
  appId: REVERT_FINANCE_DEFINITION.id,
  providers: [
    ArbitrumRevertFinanceBalanceFetcher,
    EthereumRevertFinanceBalanceFetcher,
    OptimismRevertFinanceBalanceFetcher,
    PolygonRevertFinanceBalanceFetcher,
    UniswapV3LiquidityTokenHelper,
    UniswapV2ContractFactory,
    RevertFinanceAppDefinition,
    RevertFinanceContractFactory,
  ],
})
export class RevertFinanceAppModule extends AbstractApp() {}
