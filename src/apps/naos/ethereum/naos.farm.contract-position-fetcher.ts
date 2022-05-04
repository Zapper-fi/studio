import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import UNISWAP_V2_DEFINITION from '~apps/uniswap-v2/uniswap-v2.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { NaosStakingPools, NaosContractFactory } from '../contracts';
import { NAOS_DEFINITION } from '../naos.definition';

const appId = NAOS_DEFINITION.id;
const groupId = NAOS_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumNaosFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT)
    private readonly appToolkit: IAppToolkit,
    @Inject(NaosContractFactory) private readonly contractFactory: NaosContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<NaosStakingPools>({
      address: '0x99e4ea9ef6bf396c49b35ff9478ebb8890aef581',
      appId,
      groupId,
      network,
      dependencies: [
        { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
        { appId: UNISWAP_V2_DEFINITION.id, groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id], network },
      ],
      resolveContract: ({ address, network }) => this.contractFactory.naosStakingPools({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolCount(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall.wrap(contract).getPoolToken(poolIndex),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).reward(),
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: async ({ poolIndex, contract, multicall }) =>
          multicall.wrap(contract).getPoolRewardWeight(poolIndex),
        resolveTotalAllocPoints: ({ multicall, contract }) => multicall.wrap(contract).totalRewardWeight(),
        resolveTotalRewardRate: ({ multicall, contract }) => multicall.wrap(contract).rewardRate(),
      }),
    });
  }
}
