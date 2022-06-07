import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VvsCraftsman, VvsFinanceContractFactory } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const appId = VVS_FINANCE_DEFINITION.id;
const groupId = VVS_FINANCE_DEFINITION.groups.farm.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosVvsFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  async getPositions() {
    const positions = await this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<VvsCraftsman>(
      {
        network,
        groupId,
        appId,
        address: '0xDccd6455AE04b03d785F12196B492b18129564bc',
        dependencies: [{ appId, groupIds: [VVS_FINANCE_DEFINITION.groups.pool.id], network }],
        resolveContract: opts => this.contractFactory.vvsCraftsman(opts),
        resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
        resolveDepositTokenAddress: ({ multicall, contract, poolIndex }) =>
          multicall
            .wrap(contract)
            .poolInfo(poolIndex)
            .then(pool => pool.lpToken),
        resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).vvs(),
        rewardRateUnit: RewardRateUnit.BLOCK,
        resolveRewardRate: this.appToolkit.helpers.masterChefDefaultRewardsPerBlockStrategy.build({
          resolvePoolAllocPoints: ({ multicall, contract, poolIndex }) =>
            multicall
              .wrap(contract)
              .poolInfo(poolIndex)
              .then(i => i.allocPoint),
          resolveTotalAllocPoints: async ({ multicall, contract /*, poolIndex */ }) => {
            return multicall.wrap(contract).totalAllocPoint();
          },
          resolveTotalRewardRate: async ({ multicall, contract /*, poolIndex */ }) => {
            return multicall.wrap(contract).vvsPerBlock();
          },
        }),
      },
    );

    return positions;
  }
}
