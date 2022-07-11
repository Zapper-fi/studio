import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { FerroContractFactory, FerroFarm } from '../contracts';
import { FERRO_DEFINITION } from '../ferro.definition';

const appId = FERRO_DEFINITION.id;
const groupId = FERRO_DEFINITION.groups.stakedLiquidity.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosFerroStakedLiquidityContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(FerroContractFactory) private readonly ferroContractFactory: FerroContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<FerroFarm>({
      address: '0xab50fb1117778f293cc33ac044b5579fb03029d0',
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId,
          groupIds: [FERRO_DEFINITION.groups.pool.id],
          network,
        },
      ],
      resolveContract: ({ address, network }) => this.ferroContractFactory.ferroFarm({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) => multicall.wrap(contract).poolInfo(poolIndex).then(info => info.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).fer(),
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(i => i.allocPoint),
        resolveTotalAllocPoints: async ({ multicall, contract /*, poolIndex */ }) => {
          return multicall.wrap(contract).totalAllocPoint();
        },
        resolveTotalRewardRate: async ({ multicall, contract /*, poolIndex */ }) => {
          return multicall.wrap(contract).ferPerBlock();
        },
      }),
    });
  }
}
