import { Inject } from '@nestjs/common';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { PolynomialContractFactory } from '../contracts';
import { POLYNOMIAL_DEFINITION } from '../polynomial.definition';

const network = Network.OPTIMISM_MAINNET;
const resolverAddress = '0xe38462409a2d960d9431ac452d5ffa20f4120f51';

@Register.BalanceFetcher(POLYNOMIAL_DEFINITION.id, network)
export class OptimismPolynomialBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) private readonly contractFactory: PolynomialContractFactory,
  ) {}

  async getVaultBalances(address: string) {
    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId: POLYNOMIAL_DEFINITION.id,
      groupId: POLYNOMIAL_DEFINITION.groups.vaults.id,
      network,
      resolveBalances: async ({ address, network, multicall, contractPosition: position }) => {
        const token = position.tokens[0];
        const contract = this.contractFactory.vaults({ address: resolverAddress, network });
        const balances = await multicall.wrap(contract).getUserBalance(address, position.address);
        const totalBalance =
          Number(balances._balance) + Number(balances._withdrawToComplete) + Number(balances._cancellableWithdraw);
        return [drillBalance(token, totalBalance.toString())];
      },
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
