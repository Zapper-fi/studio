import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TrisolarisMasterChef, TrisolarisRewarder, TrisolarisContractFactory } from '../contracts';
import TRISOLARIS_DEFINITION from '../trisolaris.definition';

const appId = TRISOLARIS_DEFINITION.id;
const groupId = TRISOLARIS_DEFINITION.groups.farm.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AuroraTrisolarisFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TrisolarisContractFactory) private readonly contractFactory: TrisolarisContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<TrisolarisMasterChef>({
      address: '0x3838956710bcc9d122dd23863a0549ca8d5675d6',
      appId,
      groupId,
      network,
      dependencies: [{ appId: TRISOLARIS_DEFINITION.id, groupIds: [TRISOLARIS_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.trisolarisMasterChef({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) => multicall.wrap(contract).lpToken(poolIndex),
      resolveRewardTokenAddresses: this.appToolkit.helpers.masterChefV2ClaimableTokenStrategy.build<
        TrisolarisMasterChef,
        TrisolarisRewarder
      >({
        resolvePrimaryClaimableToken: ({ multicall, contract }) => multicall.wrap(contract).TRI(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).rewarder(poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.trisolarisRewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableToken: ({ multicall, rewarderContract }) =>
          multicall.wrap(rewarderContract).rewardToken(),
      }),
      resolveRewardRate: this.appToolkit.helpers.masterChefV2RewardRateStrategy.build<
        TrisolarisMasterChef,
        TrisolarisRewarder
      >({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolvePrimaryTotalRewardRate: async ({ multicall, contract }) => multicall.wrap(contract).triPerBlock(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).rewarder(poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.trisolarisRewarder({ address: rewarderAddress, network }),
        resolveSecondaryTotalRewardRate: async ({ multicall, rewarderContract }) =>
          multicall
            .wrap(rewarderContract)
            .tokenPerBlock()
            .catch(() => '0'),
      }),
    });
  }
}
