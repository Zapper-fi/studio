import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ConvexDepositTokenFetcher } from '../common/convex.deposit.token-fetcher';

@PositionTemplate()
export class EthereumConvexDepositTokenFetcher extends ConvexDepositTokenFetcher {
  groupLabel = 'Liqudity Pool Staking';
  boosterAddress = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';
}
