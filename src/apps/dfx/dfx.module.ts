import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { DfxContractFactory } from './contracts';
import DFX_DEFINITION, { DfxAppDefinition } from './dfx.definition';
import { EthereumDfxBalanceFetcher } from './ethereum/dfx.balance-fetcher';
import { EthereumDfxCurveTokenFetcher } from './ethereum/dfx.curve.token-fetcher';
import { EthereumDfxStakingContractPositionFetcher } from './ethereum/dfx.staking.contract-position-fetcher';
import { PolygonDfxBalanceFetcher } from './polygon/dfx.balance-fetcher';
import { PolygonDfxCurveTokenFetcher } from './polygon/dfx.curve.token-fetcher';
import { PolygonDfxStakingContractPositionFetcher } from './polygon/dfx.staking.contract-position-fetcher';

@Register.AppModule({
  appId: DFX_DEFINITION.id,
  providers: [
    DfxAppDefinition,
    DfxContractFactory,
    // Ethereum
    EthereumDfxBalanceFetcher,
    EthereumDfxCurveTokenFetcher,
    EthereumDfxStakingContractPositionFetcher,
    // Polygon
    PolygonDfxBalanceFetcher,
    PolygonDfxCurveTokenFetcher,
    PolygonDfxStakingContractPositionFetcher,
  ],
})
export class DfxAppModule extends AbstractApp() {}
