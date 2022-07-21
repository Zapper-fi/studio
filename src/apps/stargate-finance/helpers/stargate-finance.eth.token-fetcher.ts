import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';

import { StargateFinanceContractFactory, StargateEth } from '../contracts';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.eth.id;

export class StargateFinanceEthTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateFinanceContractFactory)
    private readonly contractFactory: StargateFinanceContractFactory,
  ) { }

  async getPositions({ network, address }) {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<StargateEth>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => [address],
      resolveContract: ({ address, network }) => this.contractFactory.stargateEth({ address, network }),
      resolveUnderlyingTokenAddress: () => ZERO_ADDRESS,
      resolveReserve: ({ multicall, contract }) => multicall.wrap(contract).totalSupply().then(Number),
      resolvePricePerShare: ({ underlyingToken }) => underlyingToken.price,
    });
  }
}
