import { Inject } from '@nestjs/common';

import { MasterChefDefaultRewardsPerBlockStrategy } from '~app-toolkit';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { MasterChefContractPositionHelper } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { MasterChefRewarderClaimableTokenStrategy } from '~app-toolkit/helpers/master-chef/master-chef.rewarder.claimable-token-strategy';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SushiswapContractFactory, SushiSwapMiniChef, SushiSwapRewarder } from '../contracts';
import { SUSHISWAP_DEFINITION } from '../sushiswap.definition';

const appId = SUSHISWAP_DEFINITION.id;
const groupId = SUSHISWAP_DEFINITION.groups.chefV2Farm.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class PolygonSushiSwapChefV2FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MasterChefContractPositionHelper)
    private readonly masterchefFarmContractPositionHelper: MasterChefContractPositionHelper,
    @Inject(MasterChefDefaultRewardsPerBlockStrategy)
    private readonly masterChefDefaultRewardsPerBlockStrategy: MasterChefDefaultRewardsPerBlockStrategy,
    @Inject(SushiswapContractFactory) private readonly contractFactory: SushiswapContractFactory,
    @Inject(MasterChefRewarderClaimableTokenStrategy)
    private readonly masterChefRewarderClaimableTokenStrategy: MasterChefRewarderClaimableTokenStrategy,
  ) {}

  async getPositions() {
    return this.masterchefFarmContractPositionHelper.getContractPositions<SushiSwapMiniChef>({
      address: '0x0769fd68dfb93167989c6f7254cd0d766fb2841f',
      appId,
      groupId,
      network,
      dependencies: [{ appId: SUSHISWAP_DEFINITION.id, groupIds: [SUSHISWAP_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.sushiSwapMiniChef({ network, address }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) => multicall.wrap(contract).lpToken(poolIndex),
      resolveRewardTokenAddresses: this.masterChefRewarderClaimableTokenStrategy.build<
        SushiSwapMiniChef,
        SushiSwapRewarder
      >({
        resolvePrimaryClaimableToken: ({ multicall, contract }) => multicall.wrap(contract).SUSHI(),
        resolveRewarderAddress: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).rewarder(poolIndex),
        resolveRewarderContract: ({ network, rewarderAddress }) =>
          this.contractFactory.sushiSwapRewarder({ address: rewarderAddress, network }),
        resolveSecondaryClaimableToken: ({ multicall, poolIndex, rewarderContract }) =>
          multicall
            .wrap(rewarderContract)
            .pendingTokens(poolIndex, ZERO_ADDRESS, 0)
            .then(v => v.rewardTokens[0]),
      }),
      // @TODO Support multi-reward ROIs
      resolveRewardRate: this.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(v => v.allocPoint),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalAllocPoint(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).sushiPerSecond(),
      }),
    });
  }
}
