import { Inject } from '@nestjs/common';
import { getAddress } from 'ethers/lib/utils';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { accountBalancesQuery, CompoundorAccountBalances } from '../graphql/accountBalancesQuery';
import { generateGraphUrlForNetwork } from '../graphql/graphUrlGenerator';
import { getCompoundorContractPosition } from '../helpers/contractPositionParser';
import { REVERT_FINANCE_DEFINITION } from '../revert-finance.definition';

const network = Network.ETHEREUM_MAINNET;

@Register.BalanceFetcher(REVERT_FINANCE_DEFINITION.id, network)
export class EthereumRevertFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getCompoundorAccountBalances(address: string) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await graphHelper.requestGraph<CompoundorAccountBalances>({
      endpoint: generateGraphUrlForNetwork(network),
      query: accountBalancesQuery,
      variables: { address: getAddress(address) },
    });
    if (!data) return [];
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const accountBalances: Array<ContractPositionBalance> = [];
    data.accountBalances.map(({ token, balance }) => {
      const existingToken = baseTokens.find(item => item.address === token)!;
      if (!token) return [];
      accountBalances.push(getCompoundorContractPosition(network, existingToken, balance));
    });
    return accountBalances;
  }

  async getBalances(address: string) {
    const [compoundorAccountBalances] = await Promise.all([this.getCompoundorAccountBalances(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Compoundor rewards',
        assets: compoundorAccountBalances,
      },
    ]);
  }
}
