import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmfinanceChefV2, MmfinanceContractFactory } from '../contracts';
import { MMFINANCE_DEFINITION } from '../mmfinance.definition';

const appId = MMFINANCE_DEFINITION.id;
const groupId = MMFINANCE_DEFINITION.groups.farmV2.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosChainMmfinanceFarmV2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmfinanceContractFactory) private readonly contractFactory: MmfinanceContractFactory,
  ) {}

  getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<MmfinanceChefV2>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652',
      dependencies: [{ appId, groupIds: [MMFINANCE_DEFINITION.groups.pool.id], network }],
      resolveContract: opts => this.contractFactory.mmfinanceChefV2(opts),
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
          return multicall.wrap(contract).meerkatPerBlock(poolInfo.isRegular);
        },
      }),
    });
  }
}
