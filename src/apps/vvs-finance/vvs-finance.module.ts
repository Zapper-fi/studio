import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';
import { UniswapV2AppModule } from '~apps/uniswap-v2';

import { VvsFinanceContractFactory } from './contracts';
import { CronosVvsFinanceAutoVvsMineContractPositionFetcher } from './cronos/vvs-finance.auto-vvs-mine.contract-position-fetcher';
import { CronosVvsFinanceBalanceFetcher } from './cronos/vvs-finance.balance-fetcher';
import { CronosVvsFinanceFarmV2ContractPositionFetcher } from './cronos/vvs-finance.farm-v2.contract-position-fetcher';
import { CronosVvsFinanceFarmContractPositionFetcher } from './cronos/vvs-finance.farm.contract-position-fetcher';
import { CronosVvsFinanceMinesContractPositionFetcher } from './cronos/vvs-finance.mines.contract-position-fetcher';
import { CronosVvsFinancePoolAddressCacheManager } from './cronos/vvs-finance.pool.cache-manager';
import { CronosVvsFinancePoolTokenFetcher } from './cronos/vvs-finance.pool.token-fetcher';
import { CronosVvsFinanceXvvsVaultContractPositionFetcher } from './cronos/vvs-finance.xvvs.contract-position-fetcher';
import { CronosVvsFinanceXvvsTokenFetcher } from './cronos/vvs-finance.xvvs.token-fetcher';
import { VvsFinanceAppDefinition, VVS_FINANCE_DEFINITION } from './vvs-finance.definition';

@Register.AppModule({
  appId: VVS_FINANCE_DEFINITION.id,
  imports: [UniswapV2AppModule],
  providers: [
    CronosVvsFinanceBalanceFetcher,
    CronosVvsFinanceFarmContractPositionFetcher,
    CronosVvsFinanceFarmV2ContractPositionFetcher,
    CronosVvsFinancePoolAddressCacheManager,
    CronosVvsFinancePoolTokenFetcher,
    CronosVvsFinanceAutoVvsMineContractPositionFetcher,
    CronosVvsFinanceMinesContractPositionFetcher,
    CronosVvsFinanceXvvsVaultContractPositionFetcher,
    CronosVvsFinanceXvvsTokenFetcher,
    VvsFinanceAppDefinition,
    VvsFinanceContractFactory,
  ],
})
export class VvsFinanceAppModule extends AbstractApp() {}
