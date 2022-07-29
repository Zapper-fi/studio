import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GMX_DEFINITION } from '../gmx.definition';
import { GmxEsGmxTokenHelper } from '../helpers/gmx.es-gmx.token-helper';

const appId = GMX_DEFINITION.id;
const groupId = GMX_DEFINITION.groups.esGmx.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class ArbitrumGmxEsGmxTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(GmxEsGmxTokenHelper) private readonly gmxEsGmxTokenHelper: GmxEsGmxTokenHelper) {}

  async getPositions() {
    return this.gmxEsGmxTokenHelper.getTokens({
      esGmxTokenAddress: '0xf42ae1d54fd613c9bb14810b0588faaa09a426ca',
      network,
    });
  }
}
