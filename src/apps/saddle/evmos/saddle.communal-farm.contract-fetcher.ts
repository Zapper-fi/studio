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
  // Saddle Frax 3 Pool Farm
  {
    address: '0x0232e0b6df048c8cc4037c52bc90cf943c9c8cc6',
    stakedTokenAddress: '0x2801fe8f9de3a4ad6098a5b95d5165676bb01f82',
    rewardTokenAddresses: ['0x3344e55c6dde2a01f4ed893f97bac1f99ec24f8b'],
  },
];

const appId = SADDLE_DEFINITION.id;
const groupId = SADDLE_DEFINITION.groups.communalFarm.id;
const network = Network.EVMOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EvmosSaddleCommunalFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
          network: Network.EVMOS_MAINNET,
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