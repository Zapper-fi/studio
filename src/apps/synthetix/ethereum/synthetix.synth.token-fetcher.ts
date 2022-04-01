import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixSynthTokenHelper } from '../helpers/synthetix.synth.token-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

@Register.TokenPositionFetcher({
  appId: SYNTHETIX_DEFINITION.id,
  groupId: SYNTHETIX_DEFINITION.groups.synth.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumSynthetixSynthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(SynthetixSynthTokenHelper) private readonly tokenHelper: SynthetixSynthTokenHelper) {}

  async getPositions() {
    return this.tokenHelper.getTokens({
      network: Network.ETHEREUM_MAINNET,
      resolverAddress: '0x823be81bbf96bec0e25ca13170f5aacb5b79ba83',
    });
  }
}
