import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TraderJoeChefV2Rewarder, TraderJoeChefV3, TraderJoeContractFactory } from '../contracts';
import { TRADER_JOE_DEFINITION } from '../trader-joe.definition';

@Register.ContractPositionFetcher({
  appId: TRADER_JOE_DEFINITION.id,
  groupId: TRADER_JOE_DEFINITION.groups.chefV3Farm.id,
  network: Network.AVALANCHE_MAINNET,
})
export class AvalancheTraderJoeChefV3FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory) private readonly traderJoeContractFactory: TraderJoeContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<TraderJoeChefV3>({
      address: '0x188bed1968b795d5c9022f6a0bb5931ac4c18f00',
      appId: TRADER_JOE_DEFINITION.id,
      groupId: TRADER_JOE_DEFINITION.groups.chefV3Farm.id,
      network: Network.AVALANCHE_MAINNET,
      dependencies: [
        {
          appId: TRADER_JOE_DEFINITION.id,
          groupIds: [TRADER_JOE_DEFINITION.groups.pool.id, TRADER_JOE_DEFINITION.groups.xJoe.id],
          network: Network.AVALANCHE_MAINNET,
        },
      ],
      resolveContract: ({ address, network }) => this.traderJoeContractFactory.traderJoeChefV3({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: this.appToolkit.helpers.masterChefRewarderClaimableTokenStrategy.build<
        TraderJoeChefV3,
        TraderJoeChefV2Rewarder
      >({
        resolvePrimaryClaimableToken: ({ multicall, contract }) => multicall.wrap(contract).JOE(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.rewarder),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.traderJoeContractFactory.traderJoeChefV2Rewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableToken: ({ multicall, rewarderContract }) =>
          multicall.wrap(rewarderContract).rewardToken(),
      }),
      resolveRewardRate: this.appToolkit.helpers.masterChefV2RewardRateStrategy.build<
        TraderJoeChefV3,
        TraderJoeChefV2Rewarder
      >({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolvePrimaryTotalRewardRate: async ({ multicall, contract }) => multicall.wrap(contract).joePerSec(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.rewarder),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.traderJoeContractFactory.traderJoeChefV2Rewarder({ address: rewarderAddress, network }),
        resolveSecondaryTotalRewardRate: async ({ multicall, rewarderContract }) =>
          multicall
            .wrap(rewarderContract)
            .rewardPerSecond()
            .catch(() => '0'),
      }),
    });
  }
}
