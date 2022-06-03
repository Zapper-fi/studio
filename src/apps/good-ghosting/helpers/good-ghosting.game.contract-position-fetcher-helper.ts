import { Inject, Injectable } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';
import { ContractPosition } from '~position/position.interface';
import { SingleStakingFarmDataProps } from '~app-toolkit';
import { CURVE_DEFINITION } from '~apps/curve';

import { GoodGhostingContractFactory, GoodghostingAbiV001 } from '../contracts';
import { GoodGhostingGameConfigFetcherHelper } from '../helpers/good-ghosting.game.config-fetcher';

@Injectable()
export class GoodGhostingGameContractPositionFetcherHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingContractFactory) private readonly goodGhostingContractFactory: GoodGhostingContractFactory,
    @Inject(GoodGhostingGameConfigFetcherHelper)
    private readonly goodGhostingGameConfigFetcherHelper: GoodGhostingGameConfigFetcherHelper,
  ) {}

  async getContractPosition(
    network: Network,
    networkId: string,
    appId: string,
    groupId: string,
  ): Promise<ContractPosition<SingleStakingFarmDataProps>[]> {
    const GAMES = await this.goodGhostingGameConfigFetcherHelper.getGameConfigs(networkId);
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<GoodghostingAbiV001>({
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveFarmDefinitions: async () => GAMES,
      resolveFarmContract: ({ address, network }) =>
        this.goodGhostingContractFactory.goodghostingAbiV001({ address, network }),
      resolveIsActive: async () => true,
      resolveRois: async () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
