import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DfxCurveTokenFetcher } from '../common/dfx.curve.token-fetcher';

@PositionTemplate()
export class EthereumDfxCurveTokenFetcher extends DfxCurveTokenFetcher {
  groupLabel = 'DFX Curves';
  poolAddresses = [
    '0xa6c0cbcaebd93ad3c6c94412ec06aaa37870216d', // cadc-Usdc
    '0x1a4ffe0dcbdb4d551cfca61a5626afd190731347', // eurs-Usdc
    '0x2bab29a12a9527a179da88f422cdaaa223a90bd5', // xsgd-Usdc
    '0xe9669516e09f5710023566458f329cce6437aaac', // nzds-Usdc
    '0xc574a613a3900e4314da13eb2287f13689a5b64d', // tryb-Usdc
    '0xdd39379ab7c93b9baae29e6ec03795d0bc99a889', // xidr-Usdc
  ];
}
