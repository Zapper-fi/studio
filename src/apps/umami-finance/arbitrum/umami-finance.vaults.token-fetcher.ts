import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { UmamiFinanceContractFactory, UmamiFinanceVault } from '../contracts';
import { UMAMI_FINANCE_DEFINITION } from '../umami-finance.definition';

const appId = UMAMI_FINANCE_DEFINITION.id;
const groupId = UMAMI_FINANCE_DEFINITION.groups.vaults.id;
const network = Network.ARBITRUM_MAINNET;
const VAULTS = [
  '0x2e2153fd13459eba1f277ab9acd624f045d676ce', // glpUSDC
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumUmamiFinanceVaultsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UmamiFinanceContractFactory) private readonly umamiFinanceContractFactory: UmamiFinanceContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<UmamiFinanceVault>({
      appId,
      groupId,
      network,
      resolveContract: ({ address, network }) =>
        this.umamiFinanceContractFactory.umamiFinanceVault({ address, network }),
      resolveVaultAddresses: () => VAULTS,
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).asset(),
      resolveReserve: async ({ underlyingToken, multicall, address }) =>
        multicall
          .wrap(this.appToolkit.globalContracts.erc20(underlyingToken))
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: async ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .pricePerShare()
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
    });
  }
}
