import { Register } from '~app-toolkit/decorators';
import { AbstractApp } from '~app/app.dynamic-module';

import { DfxContractFactory } from './contracts';
import DFX_DEFINITION, { DfxAppDefinition } from './dfx.definition';
import { EthereumDfxCurveTokenFetcher } from './ethereum/dfx.curve.token-fetcher';
import { EthereumDfxStakingContractPositionFetcher } from './ethereum/dfx.staking.contract-position-fetcher';
import { PolygonDfxCurveTokenFetcher } from './polygon/dfx.curve.token-fetcher';
import { PolygonDfxStakingContractPositionFetcher } from './polygon/dfx.staking.contract-position-fetcher';

@Register.AppModule({
  appId: DFX_DEFINITION.id,
  providers: [
    DfxAppDefinition,
    DfxContractFactory,
    // Ethereum
    EthereumDfxCurveTokenFetcher,
    EthereumDfxStakingContractPositionFetcher,
    // Polygon
    PolygonDfxCurveTokenFetcher,
    PolygonDfxStakingContractPositionFetcher,
  ],
})
export class DfxAppModule extends AbstractApp() {}
