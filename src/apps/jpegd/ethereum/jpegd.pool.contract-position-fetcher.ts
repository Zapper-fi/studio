import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { JpegdContractFactory, JpegdLpFarm } from '../contracts';
import { JPEGD_DEFINITION } from '../jpegd.definition';

const appId = JPEGD_DEFINITION.id;
const groupId = JPEGD_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumJpegdPoolContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(JpegdContractFactory) private readonly jpegdContractFactory: JpegdContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<JpegdLpFarm>({
      address: '0x3eed641562ac83526d7941e4326559e7b607556b',
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: 'sushiswap',
          groupIds: ['pool'],
          network,
        },
      ],
      resolveContract: ({ address, network }) => this.jpegdContractFactory.jpegdLpFarm({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).jpeg(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) =>
          multicall
            .wrap(contract)
            .epoch()
            .then(x => x.rewardPerBlock),
      }),
    });
  }
}
