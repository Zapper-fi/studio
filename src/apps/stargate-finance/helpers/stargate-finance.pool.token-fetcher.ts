import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { StargateFinanceContractFactory, StargatePool } from '../contracts';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.pool.id;

export class StargateFinancePoolTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateFinanceContractFactory)
    private readonly contractFactory: StargateFinanceContractFactory,
  ) {}

  async getPositions({ network, addresses }) {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<StargatePool>({
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [STARGATE_FINANCE_DEFINITION.groups.eth.id], network }],
      resolveVaultAddresses: () => addresses.map(x => x.toLowerCase()),
      resolveContract: ({ address, network }) => this.contractFactory.stargatePool({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).token(),
      resolveReserve: ({ multicall, contract }) => multicall.wrap(contract).totalSupply().then(Number),
      resolvePricePerShare: ({ underlyingToken }) => underlyingToken.price,
    });
  }
}
