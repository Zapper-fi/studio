import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixTransferrableSnxTokenHelper } from '../helpers/synthetix.transferable-snx.token-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.transferableSnx.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class OptimismSynthetixTransferableSnxTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(SynthetixTransferrableSnxTokenHelper) private readonly tokenHelper: SynthetixTransferrableSnxTokenHelper,
  ) {}

  async getPositions() {
    return this.tokenHelper.getTokens({ network });
  }
}
