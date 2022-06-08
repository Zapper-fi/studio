import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SaddleContractFactory } from '../contracts';
import { SaddleMiniChefV2 } from '../contracts/ethers/SaddleMiniChefV2';
import { SaddleMiniChefV2Rewarder } from '../contracts/ethers/SaddleMiniChefV2Rewarder';
import { SADDLE_DEFINITION } from '../saddle.definition';

const appId = SADDLE_DEFINITION.id;
const groupId = SADDLE_DEFINITION.groups.miniChefV2.id;
const network = Network.EVMOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EvmosSaddleMiniChefV2FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SaddleContractFactory) private readonly saddleContractFactory: SaddleContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<SaddleMiniChefV2>({
      address: '0x0232e0b6df048c8cc4037c52bc90cf943c9c8cc6',
      appId: SADDLE_DEFINITION.id,
      groupId: SADDLE_DEFINITION.groups.miniChefV2.id,
      network: Network.EVMOS_MAINNET,
      dependencies: [
        {
          appId: SADDLE_DEFINITION.id,
          groupIds: [SADDLE_DEFINITION.groups.pool.id],
          network: Network.EVMOS_MAINNET,
        },
      ],
      resolveContract: ({ address, network }) => this.saddleContractFactory.saddleMiniChefV2({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) => multicall.wrap(contract).lpToken(poolIndex),
      resolveRewardTokenAddresses: this.appToolkit.helpers.masterChefV2ClaimableTokenStrategy.build<
        SaddleMiniChefV2,
        SaddleMiniChefV2Rewarder
      >({
        resolvePrimaryClaimableToken: ({ multicall, contract }) => multicall.wrap(contract).SADDLE(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).rewarder(poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.saddleContractFactory.saddleMiniChefV2Rewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableToken: ({ multicall, rewarderContract }) =>
          multicall.wrap(rewarderContract).rewardToken(),
      }),
      rewardRateUnit: RewardRateUnit.SECOND,
      resolveRewardRate: this.appToolkit.helpers.masterChefV2RewardRateStrategy.build<
        SaddleMiniChefV2,
        SaddleMiniChefV2Rewarder
      >({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolvePrimaryTotalRewardRate: async ({ multicall, contract }) => multicall.wrap(contract).saddlePerSecond(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).rewarder(poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.saddleContractFactory.saddleMiniChefV2Rewarder({ address: rewarderAddress, network }),
        resolveSecondaryTotalRewardRate: async ({ multicall, rewarderContract }) =>
          multicall
            .wrap(rewarderContract)
            .rewardPerSecond()
            .catch(() => '0'),
      }),
    });
  }
}
