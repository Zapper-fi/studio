import { Inject } from '@nestjs/common';

import { MasterChefDefaultRewardsPerBlockStrategy } from '~app-toolkit';
import { Register } from '~app-toolkit/decorators';
import { MasterChefContractPositionHelper } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SushiSwapChef, SushiswapContractFactory } from '../contracts';
import { SUSHISWAP_DEFINITION } from '../sushiswap.definition';

const appId = SUSHISWAP_DEFINITION.id;
const groupId = SUSHISWAP_DEFINITION.groups.chefV1Farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumSushiSwapChefV1FarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MasterChefContractPositionHelper)
    private readonly masterchefFarmContractPositionHelper: MasterChefContractPositionHelper,
    @Inject(MasterChefDefaultRewardsPerBlockStrategy)
    private readonly masterChefDefaultRewardsPerBlockStrategy: MasterChefDefaultRewardsPerBlockStrategy,
    @Inject(SushiswapContractFactory) private readonly contractFactory: SushiswapContractFactory,
  ) {}

  async getPositions() {
    return this.masterchefFarmContractPositionHelper.getContractPositions<SushiSwapChef>({
      address: '0xc2edad668740f1aa35e4d8f227fb8e17dca888cd',
      appId,
      groupId,
      network,
      dependencies: [{ appId: SUSHISWAP_DEFINITION.id, groupIds: [SUSHISWAP_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.sushiSwapChef({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).sushi(),
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
