import { Inject } from '@nestjs/common';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleMiniChefV2, PickleRewarder } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

@Register.ContractPositionFetcher({
  appId: PICKLE_DEFINITION.id,
  groupId: PICKLE_DEFINITION.groups.masterchefV2Farm.id,
  network: Network.POLYGON_MAINNET,
})
export class PolygonPickleFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) private readonly contractFactory: PickleContractFactory,
  ) {}

  async getPositions(): Promise<ContractPosition<DefaultDataProps>[]> {
    const network = Network.POLYGON_MAINNET;

    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PickleMiniChefV2>({
      address: '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749',
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
      resolveRewardTokenAddresses: this.appToolkit.helpers.masterChefV2ClaimableTokenStrategy.build<
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
      rewardRateUnit: RewardRateUnit.SECOND,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).picklePerSecond(),
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
      }),
    });
  }
}
