import { Inject } from '@nestjs/common';

import { SingleStakingFarmContractPositionHelper } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MetavaultTradeContractFactory, RewardTracker } from '../contracts';
import { METAVAULT_TRADE_DEFINITION } from '../metavault-trade.definition';

export const MVX_FARM = {
  address: '0xe8e2e78d8ca52f238caf69f020fa961f8a7632e9', // sMVX - Staked MVX
  stakedTokenAddress: '0x2760e46d9bb43dafcbecaad1f64b93207f9f0ed7', // MVX
  rewardTokenAddresses: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0xd1b2f8dff8437be57430ee98767d512f252ead61'], // WMATIC, esMVX
  rewardTrackerAddresses: ['0xacec858f6397dd227dd4ed5be91a5bb180b8c430', '0xe8e2e78d8ca52f238caf69f020fa961f8a7632e9'], // , sbfMVX sMVX
};

export const ES_MVX_FARM = {
  address: '0xe8e2e78d8ca52f238caf69f020fa961f8a7632e9', // sMVX
  stakedTokenAddress: '0xd1b2f8dff8437be57430ee98767d512f252ead61', // EsMVX
  rewardTokenAddresses: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0xd1b2f8dff8437be57430ee98767d512f252ead61'], // WMATIC, esMVX
  rewardTrackerAddresses: [],
};

export const MVLP_FARM = {
  address: '0xabd6c70c41fdf9261dff15f4eb589b44a37072eb', // Fee MVLP
  stakedTokenAddress: '0x9f4f8bc00f48663b7c204c96b932c29ccc43a2e8', // MVLP
  rewardTokenAddresses: ['0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', '0xd1b2f8dff8437be57430ee98767d512f252ead61'], // WMATIC, esMVX
  rewardTrackerAddresses: ['0xabd6c70c41fdf9261dff15f4eb589b44a37072eb', '0xa6ca41bbf555074ed4d041c1f4551ef48116d59a'], // fMVLP, fsMVLP
};

export const FARMS = [MVX_FARM, ES_MVX_FARM, MVLP_FARM];

const appId = METAVAULT_TRADE_DEFINITION.id;
const groupId = METAVAULT_TRADE_DEFINITION.groups.farm.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class PolygonMetavaultTradeFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
    @Inject(MetavaultTradeContractFactory)
    private readonly metavaultTradeContractFactory: MetavaultTradeContractFactory,
  ) {}

  async getPositions() {
    return this.singleStakingFarmContractPositionHelper.getContractPositions<RewardTracker>({
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: METAVAULT_TRADE_DEFINITION.id,
          groupIds: [METAVAULT_TRADE_DEFINITION.groups.esMvx.id, METAVAULT_TRADE_DEFINITION.groups.mvlp.id],
          network,
        },
      ],
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) =>
        this.metavaultTradeContractFactory.rewardTracker({ network, address }),
      resolveIsActive: () => true,
      resolveRois: () => ({ dailyROI: 0, weeklyROI: 0, yearlyROI: 0 }),
    });
  }
}
