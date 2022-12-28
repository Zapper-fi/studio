import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DfxCurveTokenFetcher } from '../common/dfx.curve.token-fetcher';

@PositionTemplate()
export class PolygonDfxCurveTokenFetcher extends DfxCurveTokenFetcher {
  groupLabel = 'DFX Curves';
  poolAddresses = [
    '0x288ab1b113c666abb097bb2ba51b8f3759d7729e', // cadc-Usdc
    '0xb72d390e07f40d37d42dfcc43e954ae7c738ad44', // eurs-Usdc
    '0x8e3e9cb46e593ec0caf4a1dcd6df3a79a87b1fd7', // xsgd-Usdc
    '0x931d6a6cc3f992beee80a1a14a6530d34104b000', // nzds-Usdc
    '0xea75cd0b12a8b48f5bddad37ceb15f8cb3d2cc75', // tryb-Usdc
  ];
}
