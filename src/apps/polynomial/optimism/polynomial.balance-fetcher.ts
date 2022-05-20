import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PolynomialContractFactory, PolynomialCoveredCall } from '../contracts';
import { POLYNOMIAL_DEFINITION } from '../polynomial.definition';

const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(POLYNOMIAL_DEFINITION.id, network)
export class OptimismPolynomialBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) private readonly contractFactory: PolynomialContractFactory,
  ) {}

  async getVaultBalances(address: string) {
    return this.appToolkit.helpers.masterChefContractPositionBalanceHelper.getBalances<PolynomialCoveredCall>({
      address,
      appId: POLYNOMIAL_DEFINITION.id,
      groupId: POLYNOMIAL_DEFINITION.groups.vaults.id,
      network: Network.OPTIMISM_MAINNET,
      resolveChefContract: ({ contractAddress, network }) =>
        this.contractFactory.polynomialCoveredCall({ address: contractAddress, network }),
      resolveStakedTokenBalance: this.appToolkit.helpers.masterChefDefaultStakedBalanceStrategy.build({
        resolveStakedBalance: async ({ address, contract, multicall, contractPosition }) => {
          const userInfo = await multicall.wrap(contract).userInfos(address);
          return (
            Number(userInfo.pendingDeposit) +
            (Number(userInfo.withdrawnShares) + Number(userInfo.totalShares)) * contractPosition.dataProps.weeklyROI
          );
        },
      }),
      resolveClaimableTokenBalances: async () => [],
    });
  }

  async getBalances(address: string) {
    const assets = await this.getVaultBalances(address);
    return presentBalanceFetcherResponse([
      {
        label: 'Vaults',
        assets,
      },
    ]);
  }
}
