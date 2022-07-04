import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixSynthTokenHelper } from '../helpers/synthetix.synth.token-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.synth.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class OptimismSynthetixSynthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(SynthetixSynthTokenHelper) private readonly tokenHelper: SynthetixSynthTokenHelper) {}

  async getPositions() {
    return this.tokenHelper.getTokens({
      network,
      resolverAddress: '0x95a6a3f44a70172e7d50a9e28c85dfd712756b8c',
    });
  }
}
