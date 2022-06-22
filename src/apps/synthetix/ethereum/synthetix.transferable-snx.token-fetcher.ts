import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixTrasnferrableSnxTokenHelper } from '../helpers/synthetix.trasnferable-snx.token-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.transferableSnx.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSynthetixTransferableSnxTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(SynthetixTrasnferrableSnxTokenHelper) private readonly tokenHelper: SynthetixTrasnferrableSnxTokenHelper,
  ) {}

  async getPositions() {
    return this.tokenHelper.getTokens({ network });
  }
}
