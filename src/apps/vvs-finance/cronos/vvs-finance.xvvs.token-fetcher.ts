import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VvsFinanceContractFactory, VvsBar } from '../contracts';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const appId = VVS_FINANCE_DEFINITION.id;
const groupId = VVS_FINANCE_DEFINITION.groups.xvvs.id;
const network = Network.CRONOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class CronosVvsFinanceXvvsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<VvsBar>({
      appId,
      groupId,
      network,
      resolveContract: opts => this.contractFactory.vvsBar(opts),
      resolveVaultAddresses: () => ['0x7fe4db9063b7dd7ba55313b9c258070bed2c143a'],
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).vvs(),
      resolveReserve: async ({ underlyingToken, multicall, address }) =>
        multicall
          .wrap(this.appToolkit.globalContracts.erc20(underlyingToken))
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
    });
  }
}
