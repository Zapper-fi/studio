import { Inject } from '@nestjs/common';
import { getAddress } from 'ethers/lib/utils';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { accountBalancesQuery, CompoundorUserPosition } from '../graphql/accountBalancesQuery';
import { generateGraphUrlForNetwork } from '../graphql/graphUrlGenerator';
import { getCompoundorContractPosition } from '../helpers/contractPositionParser';
import { REVERT_FINANCE_DEFINITION } from '../revert-finance.definition';

const network = Network.POLYGON_MAINNET;

@Register.BalanceFetcher(REVERT_FINANCE_DEFINITION.id, network)
export class PolygonRevertFinanceBalanceFetcher implements BalanceFetcher {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getAccumulatedCompoundorRewards(address: string) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await graphHelper.requestGraph<CompoundorUserPosition>({
      endpoint: generateGraphUrlForNetwork(network),
      query: accountBalancesQuery,
      variables: { address: getAddress(address) },
    });
    if (!data) return [];
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const rewards: Array<ContractPositionBalance> = [];
    data.accountBalances.map(({ token, balance }) => {
      const existingToken = baseTokens.find(item => item.address === token)!;
      if (!token) return [];

      rewards.push(getCompoundorContractPosition(network, existingToken, balance));
    });
    return rewards;
  }

  async getBalances(address: string) {
    const [accumulatedCompoundorRewards] = await Promise.all([this.getAccumulatedCompoundorRewards(address)]);

    return presentBalanceFetcherResponse([
      {
        label: 'Compoundor rewards',
        assets: accumulatedCompoundorRewards,
      },
    ]);
  }
}
