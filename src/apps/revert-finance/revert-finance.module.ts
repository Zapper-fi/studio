import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { UniswapV3ContractFactory } from '~apps/uniswap-v3/contracts';

import { ArbitrumRevertFinanceCompoundorContractPositionFetcher } from './arbitrum/revert-finance.compoundor.contract-position-fetcher';
import { RevertFinanceContractFactory } from './contracts';
import { EthereumRevertFinanceCompoundorContractPositionFetcher } from './ethereum/revert-finance.compoundor.contract-position-fetcher';
import { OptimismRevertFinanceCompoundorContractPositionFetcher } from './optimism/revert-finance.compoundor.contract-position-fetcher';
import { PolygonRevertFinanceCompoundorContractPositionFetcher } from './polygon/revert-finance.compoundor.contract-position-fetcher';
import { RevertFinanceAppDefinition, REVERT_FINANCE_DEFINITION } from './revert-finance.definition';

@Register.AppModule({
  appId: REVERT_FINANCE_DEFINITION.id,
  providers: [
    RevertFinanceAppDefinition,
    RevertFinanceContractFactory,
    UniswapV3ContractFactory,
    UniswapV3LiquidityContractPositionBuilder,
    ArbitrumRevertFinanceCompoundorContractPositionFetcher,
    EthereumRevertFinanceCompoundorContractPositionFetcher,
    OptimismRevertFinanceCompoundorContractPositionFetcher,
    PolygonRevertFinanceCompoundorContractPositionFetcher,
  ],
})
export class RevertFinanceAppModule extends AbstractApp() {}
