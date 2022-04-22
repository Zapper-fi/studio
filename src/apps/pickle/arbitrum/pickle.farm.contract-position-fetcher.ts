import { Inject } from '@nestjs/common';

import {
  MasterChefContractPositionHelper,
  MasterChefDefaultRewardsPerBlockStrategy,
  MasterChefRewarderClaimableTokenStrategy,
} from '~app-toolkit';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleMiniChefV2, PickleRewarder } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

@Register.ContractPositionFetcher({
  appId: PICKLE_DEFINITION.id,
  groupId: PICKLE_DEFINITION.groups.masterchefV2Farm.id,
  network: Network.ARBITRUM_MAINNET,
})
export class ArbitrumPickleFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MasterChefContractPositionHelper)
    private readonly masterchefFarmContractPositionHelper: MasterChefContractPositionHelper,
    @Inject(MasterChefDefaultRewardsPerBlockStrategy)
    private readonly masterChefDefaultRewardsPerBlockStrategy: MasterChefDefaultRewardsPerBlockStrategy,
    @Inject(PickleContractFactory) private readonly contractFactory: PickleContractFactory,
    @Inject(MasterChefRewarderClaimableTokenStrategy)
    private readonly masterChefRewarderClaimableTokenStrategy: MasterChefRewarderClaimableTokenStrategy,
  ) {}

  async getPositions(): Promise<ContractPosition<DefaultDataProps>[]> {
    const network = Network.ARBITRUM_MAINNET;

    return this.masterchefFarmContractPositionHelper.getContractPositions<PickleMiniChefV2>({
      address: '0x7ecc7163469f37b777d7b8f45a667314030ace24',
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.masterchefV2Farm.id,
      network,
      dependencies: [{ appId: PICKLE_DEFINITION.id, groupIds: [PICKLE_DEFINITION.groups.jar.id], network }],
      resolveContract: ({ address, network }) =>
        this.contractFactory.pickleMiniChefV2({
          network,
          address,
        }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) => multicall.wrap(contract).lpToken(poolIndex),
      resolveRewardTokenAddresses: this.masterChefRewarderClaimableTokenStrategy.build<
        PickleMiniChefV2,
        PickleRewarder
      >({
        resolvePrimaryClaimableToken: ({ multicall, contract }) => multicall.wrap(contract).PICKLE(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).rewarder(poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.pickleRewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableToken: ({ multicall, poolIndex, rewarderContract }) =>
          multicall
            .wrap(rewarderContract)
            .pendingTokens(poolIndex, ZERO_ADDRESS, 0)
            .then(v => v.rewardTokens[0]),
      }),
      // @TODO Support multi-reward ROIs
      resolveRewardsPerBlock: this.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardPerBlock: ({ multicall, contract }) => multicall.wrap(contract).picklePerSecond(),
      }),
    });
  }
}
