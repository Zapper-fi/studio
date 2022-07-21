import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { StargateFinanceContractFactory, StargateFarm } from '../contracts';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.farm.id;
const network = Network.ETHEREUM_MAINNET;

const address = '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b'

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumStargateFinanceFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateFinanceContractFactory)
    private readonly contractFactory: StargateFinanceContractFactory,
  ) { }

  async getPositions() {
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
