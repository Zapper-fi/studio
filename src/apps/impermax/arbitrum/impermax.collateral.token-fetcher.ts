import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxCollateralTokenHelper } from '../helpers/impermax.collateral.token-fetcher-helper';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

import { address } from './impermax.lend.token-fetcher';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.collateral.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumImpermaxCollateralTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(ImpermaxCollateralTokenHelper)
    private readonly impermaxCollateralTokenHelper: ImpermaxCollateralTokenHelper,
  ) {}

  async getPositions() {
    return this.impermaxCollateralTokenHelper.getPositions({
      address,
      network,
      dependencies: [
        { appId: 'sushiswap', groupIds: ['pool'], network },
        { appId: 'swapr', groupIds: ['pool'], network },
      ],
    });
  }
}
