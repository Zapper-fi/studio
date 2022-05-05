import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory, QiDaoMasterChef } from '../contracts';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

const FARMS: { chefAddress: string; dependencies?: AppGroupsDefinition[] }[] = [
  // QuickSwap
  {
    chefAddress: '0x574fe4e8120c4da1741b5fd45584de7a5b521f0f',
    dependencies: [
      {
        appId: 'quickswap',
        groupIds: ['pool'],
        network: Network.POLYGON_MAINNET,
      },
    ],
  },
  // Curve (legacy)
  {
    chefAddress: '0x07ca17da3b54683f004d388f206269ef128c2356',
    dependencies: [
      {
        appId: CURVE_DEFINITION.id,
        groupIds: [CURVE_DEFINITION.groups.pool.id],
        network: Network.POLYGON_MAINNET,
      },
    ],
  },
  // Curve
  {
    chefAddress: '0x0635af5ab29fc7bba007b8cebad27b7a3d3d1958',
    dependencies: [
      {
        appId: CURVE_DEFINITION.id,
        groupIds: [CURVE_DEFINITION.groups.pool.id],
        network: Network.POLYGON_MAINNET,
      },
    ],
  },
];

@Register.ContractPositionFetcher({
  appId: QI_DAO_DEFINITION.id,
  groupId: QI_DAO_DEFINITION.groups.farm.id,
  network: Network.POLYGON_MAINNET,
})
export class PolygonQiDaoFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) private readonly contractFactory: QiDaoContractFactory,
  ) {}

  async getPositions() {
    return Promise.all(
      FARMS.map(farm =>
        this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<QiDaoMasterChef>({
          address: farm.chefAddress,
          appId: QI_DAO_DEFINITION.id,
          groupId: QI_DAO_DEFINITION.groups.farm.id,
          network: Network.POLYGON_MAINNET,
          dependencies: farm.dependencies,
          resolveContract: ({ address, network }) => this.contractFactory.qiDaoMasterChef({ address, network }),
          resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
          resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
            multicall
              .wrap(contract)
              .poolInfo(poolIndex)
              .then(v => v.lpToken),
          resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).erc20(),
          resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
            resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
              multicall
                .wrap(contract)
                .poolInfo(poolIndex)
                .then(v => v.allocPoint),
            resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
            resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).rewardPerBlock(),
          }),
        }),
      ),
    ).then(v => v.flat());
  }
}
