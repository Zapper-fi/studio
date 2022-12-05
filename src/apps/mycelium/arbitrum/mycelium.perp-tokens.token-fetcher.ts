import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { MyceliumPerpTokensHelper } from '../helpers/mycelium.perp-tokens.token-helper';
import MYCELIUM_DEFINITION from '../mycelium.definition';

const appId = MYCELIUM_DEFINITION.id;
const groupId = MYCELIUM_DEFINITION.groups.perpTokens.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumMyceliumPerpTokensFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(MyceliumPerpTokensHelper) private readonly myceliumPerpTokenHelper: MyceliumPerpTokensHelper) {}

  async getPositions() {
    return this.myceliumPerpTokenHelper.getTokens();
  }
}
