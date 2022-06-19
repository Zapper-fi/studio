import { Inject } from '@nestjs/common';

import { MasterChefDefaultRewardsPerBlockStrategy } from '~app-toolkit';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { MasterChefContractPositionHelper } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { MasterChefRewarderClaimableTokenStrategy } from '~app-toolkit/helpers/master-chef/master-chef.rewarder.claimable-token-strategy';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SushiSwapChefV2, SushiswapContractFactory, SushiSwapRewarder } from '../contracts';
import { SUSHISWAP_DEFINITION } from '../sushiswap.definition';

const appId = SUSHISWAP_DEFINITION.id;
const groupId = SUSHISWAP_DEFINITION.groups.chefV2Farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumSushiSwapChefV2FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
    return this.masterchefFarmContractPositionHelper.getContractPositions<SushiSwapChefV2>({
      address: '0xef0881ec094552b2e128cf945ef17a6752b4ec5d',
      appId,
      groupId: SUSHISWAP_DEFINITION.groups.chefV2Farm.id,
      network,
      dependencies: [{ appId: SUSHISWAP_DEFINITION.id, groupIds: [SUSHISWAP_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.sushiSwapChefV2({ network, address }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) => multicall.wrap(contract).lpToken(poolIndex),
      resolveRewardTokenAddresses: this.masterChefRewarderClaimableTokenStrategy.build<
        SushiSwapChefV2,
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
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).sushiPerBlock(),
      }),
    });
  }
}
