import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PancakeswapChefV2, PancakeswapContractFactory } from '../contracts';
import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

const appId = PANCAKESWAP_DEFINITION.id;
const groupId = PANCAKESWAP_DEFINITION.groups.farmV2.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) private readonly contractFactory: PancakeswapContractFactory,
  ) {}

  getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<PancakeswapChefV2>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652',
      dependencies: [{ appId, groupIds: [PANCAKESWAP_DEFINITION.groups.pool.id], network }],
      resolveContract: opts => this.contractFactory.pancakeswapChefV2(opts),
      resolvePoolLength: async ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).lpToken(poolIndex),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).CAKE(),
      rewardRateUnit: RewardRateUnit.BLOCK,
      resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
        resolvePoolAllocPoints: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(i => i.allocPoint),
        resolveTotalAllocPoints: async ({ multicall, contract, poolIndex }) => {
          const poolInfo = await multicall.wrap(contract).poolInfo(poolIndex);
          return poolInfo.isRegular
            ? multicall.wrap(contract).totalRegularAllocPoint()
            : multicall.wrap(contract).totalSpecialAllocPoint();
        },
        resolveTotalRewardRate: async ({ multicall, contract, poolIndex }) => {
          const poolInfo = await multicall.wrap(contract).poolInfo(poolIndex);
          return multicall.wrap(contract).cakePerBlock(poolInfo.isRegular);
        },
      }),
    });
  }
}
