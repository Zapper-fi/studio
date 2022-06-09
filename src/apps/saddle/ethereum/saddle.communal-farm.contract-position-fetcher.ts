import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingIsActiveStrategy, SynthetixSingleStakingRoiStrategy } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SaddleCommunalFarm, SaddleContractFactory } from '../contracts';
import SADDLE_DEFINITION from '../saddle.definition';

const FARMS = [
  // Saddle D4 Communal Farm
  {
    address: '0x0639076265e9f88542c91dcdeda65127974a5ca5',
    stakedTokenAddress: '0xd48cf4d7fb0824cc8bae055df3092584d0a1726a',
    rewardTokenAddresses: [
      '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
      '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
      '0xdbdb4d16eda451d0503b854cf79d55697f90c8df',
      '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d',
    ],
  },
];

const appId = SADDLE_DEFINITION.id;
const groupId = SADDLE_DEFINITION.groups.communalFarms.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSaddleCommunalFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SaddleContractFactory) private readonly contractFactory: SaddleContractFactory,
    @Inject(SynthetixSingleStakingIsActiveStrategy)
    private readonly synthetixSingleStakingIsActiveStrategy: SynthetixSingleStakingIsActiveStrategy,
    @Inject(SynthetixSingleStakingRoiStrategy)
    private readonly synthetixSingleStakingRoiStrategy: SynthetixSingleStakingRoiStrategy,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<SaddleCommunalFarm>({
      appId,
      groupId,
      network,
      dependencies: [
        {
          appId: SADDLE_DEFINITION.id,
          groupIds: [SADDLE_DEFINITION.groups.pool.id],
          network: Network.ETHEREUM_MAINNET,
        },
      ],
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: opts => this.contractFactory.saddleCommunalFarm(opts),
      resolveIsActive: this.synthetixSingleStakingIsActiveStrategy.build({
        resolvePeriodFinish: ({ contract, multicall }) => multicall.wrap(contract).periodFinish(),
      }),
      resolveRois: this.synthetixSingleStakingRoiStrategy.build({
        resolveRewardRates: ({ contract, multicall }) =>
          Promise.all([
            multicall.wrap(contract).rewardRates(0),
            multicall.wrap(contract).rewardRates(1),
            multicall.wrap(contract).rewardRates(2),
            multicall.wrap(contract).rewardRates(3),
          ]),
      }),
    });
  }
}
