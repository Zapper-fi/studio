import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixSynthTokenHelper } from '../helpers/synthetix.synth.token-helper';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

const appId = SYNTHETIX_DEFINITION.id;
const groupId = SYNTHETIX_DEFINITION.groups.synth.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSynthetixSynthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(SynthetixSynthTokenHelper) private readonly tokenHelper: SynthetixSynthTokenHelper) {}

  async getPositions() {
    return await this.tokenHelper.getTokens({
      network,
      resolverAddress: '0x823be81bbf96bec0e25ca13170f5aacb5b79ba83',
      exchangeable: true,
    });
  }
}
