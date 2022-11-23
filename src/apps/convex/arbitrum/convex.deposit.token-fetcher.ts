import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ConvexDepositSidechainTokenFetcher } from '../common/convex.deposit-sidechain.token-fetcher';

@PositionTemplate()
export class ArbitrumConvexDepositTokenFetcher extends ConvexDepositSidechainTokenFetcher {
  groupLabel = 'Liqudity Pool Staking';
  boosterAddress = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';
}
