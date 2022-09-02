import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ManifoldFinanceContractFactory } from '../contracts';
import { XFold } from '../contracts/ethers';
import { MANIFOLD_FINANCE_DEFINITION } from '../manifold-finance.definition';

const appId = MANIFOLD_FINANCE_DEFINITION.id;
const groupId = MANIFOLD_FINANCE_DEFINITION.groups.staking.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumManifoldFinanceStakingTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ManifoldFinanceContractFactory)
    private readonly manifoldFinanceContractFactory: ManifoldFinanceContractFactory,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<XFold>({
      appId: MANIFOLD_FINANCE_DEFINITION.id,
      groupId: MANIFOLD_FINANCE_DEFINITION.groups.staking.id,
      network: Network.ETHEREUM_MAINNET,
      resolveContract: ({ network }) =>
        this.manifoldFinanceContractFactory.xFold({ address: '0x454bd9e2b29eb5963048cc1a8bd6fd44e89899cb', network }),
      resolveVaultAddresses: () => ['0x454bd9e2b29eb5963048cc1a8bd6fd44e89899cb'],
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolveReserve: async ({ underlyingToken, multicall, address }) =>
        multicall
          .wrap(this.appToolkit.globalContracts.erc20(underlyingToken))
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: () => 1,
    });
  }
}
