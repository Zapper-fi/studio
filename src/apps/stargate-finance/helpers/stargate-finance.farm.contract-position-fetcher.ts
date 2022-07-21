import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { StargateFinanceContractFactory, StargateFarm } from '../contracts';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.farm.id;

export class StargateFinanceFarmHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateFinanceContractFactory)
    private readonly contractFactory: StargateFinanceContractFactory,
  ) { }

  async getPositions({ network, address }) {
    return this.appToolkit.helpers.masterChefContractPositionHelper.getContractPositions<StargateFarm>({
      address,
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [STARGATE_FINANCE_DEFINITION.groups.pool.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.stargateFarm({ address, network }),
      resolvePoolLength: ({ multicall, contract }) => multicall.wrap(contract).poolLength(),
      resolveDepositTokenAddress: ({ poolIndex, contract, multicall }) =>
        multicall
          .wrap(contract)
          .poolInfo(poolIndex)
          .then(v => v.lpToken),
      resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).stargate(),
    });
  }
}
