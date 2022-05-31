import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixTrasnferrableSnxTokenHelper } from '../helpers/synthetix.trasnferable-snx.token-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

@Register.TokenPositionFetcher({
  appId: SYNTHETIX_DEFINITION.id,
  groupId: SYNTHETIX_DEFINITION.groups.transferableSnx.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumSynthetixTransferableSnxTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(SynthetixTrasnferrableSnxTokenHelper) private readonly tokenHelper: SynthetixTrasnferrableSnxTokenHelper,
  ) {}

  async getPositions() {
    return this.tokenHelper.getTokens({ network: Network.ETHEREUM_MAINNET });
  }
}
