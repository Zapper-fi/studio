import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MmFinanceChefV2, MmFinanceContractFactory } from '../contracts';
import { MM_FINANCE_DEFINITION } from '../mm-finance.definition';

const appId = MM_FINANCE_DEFINITION.id;
const groupId = MM_FINANCE_DEFINITION.groups.farmV2.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosMmFinanceFarmV2ContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MmFinanceContractFactory) private readonly contractFactory: MmFinanceContractFactory,
  ) {}

  getPositions() {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<MmFinanceChefV2>({
      network,
      groupId,
      appId,
      minimumTvl: 10000,
      address: '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652',
      dependencies: [{ appId, groupIds: [MM_FINANCE_DEFINITION.groups.pool.id], network }],
      resolveContract: opts => this.contractFactory.mmFinanceChefV2(opts),
      resolvePoolLength: async ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ multicall, contract, poolIndex }) => multicall.wrap(contract).lpToken(poolIndex),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).MEERKAT(),
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
