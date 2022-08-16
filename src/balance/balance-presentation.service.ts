import { Inject, Injectable } from '@nestjs/common';
import { get, groupBy } from 'lodash';

import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AppTokenPositionBalance, ContractPositionBalance } from '~position/position-balance.interface';
import { PositionFetcherRegistry } from '~position/position-fetcher.registry';
import { Network } from '~types';

import { TokenBalanceResponse } from './balance-fetcher.interface';
import { BalancePresenterRegistry } from './balance-presenter.registry';
import { DefaultBalancePresenterFactory } from './default.balance-presenter.factory';

export type PresentParams = {
  appId: string;
  network: Network;
  address: string;
  balances: (AppTokenPositionBalance | ContractPositionBalance)[];
};

@Injectable()
export class BalancePresentationService {
  constructor(
    @Inject(PositionFetcherRegistry) private readonly positionFetcherRegistry: PositionFetcherRegistry,
    @Inject(BalancePresenterRegistry) private readonly balancePresenterRegistry: BalancePresenterRegistry,
    @Inject(DefaultBalancePresenterFactory)
    private readonly defaultBalancePresenterFactory: DefaultBalancePresenterFactory,
  ) {}

  private groupBalancesByGroupLabel(
    balances: (AppTokenPositionBalance | ContractPositionBalance)[],
    groupLabel: string,
  ) {
    const getDynamicLabel = (label: string) => {
      const matches = label.match(/{{(.*)}}/);
      if (!matches) return null;
      return matches[1].trim();
    };

    const dynamicLabel = getDynamicLabel(groupLabel);
    if (!dynamicLabel) return { [groupLabel]: balances };
    else {
      return groupBy(balances, balance => get(balance, dynamicLabel));
    }
  }

  private async groupMetaProcessor(
    appId: string,
    network: Network,
    balances: (AppTokenPositionBalance | ContractPositionBalance)[],
  ) {
    const groupMetaResolvers = this.balancePresenterRegistry.getMetaResolvers(appId, network);
    const hasMissingGroupLabel = balances.some(({ groupLabel }) => !groupLabel);
    if (hasMissingGroupLabel) return null;

    // Group balances by group label specified in the template `this.groupLabel`
    const groupedBalances = groupBy(balances, balance => balance.groupLabel);

    const presentedBalances = await Promise.all(
      Object.entries(groupedBalances).map(async ([groupLabel, balances]) => {
        // For each group label, compute group label (might be using a selector), and group by the results
        const balancesByGroupLabel = this.groupBalancesByGroupLabel(balances, groupLabel);

        return Promise.all(
          // For each computed label group, run the meta resolve if exists
          Object.entries(balancesByGroupLabel).map(async ([computedGroupLabel, balances]) => {
            const groupMetaResolver = groupMetaResolvers?.get(groupLabel);
            if (!groupMetaResolver) return { label: computedGroupLabel, assets: balances };
            else {
              const meta = await groupMetaResolver(balances);
              return { label: computedGroupLabel, assets: balances, meta };
            }
          }),
        );
      }),
    );

    return presentBalanceFetcherResponse(presentedBalances.flat());
  }

  async present({ appId, address, network, balances }: PresentParams): Promise<TokenBalanceResponse> {
    const presenter =
      this.balancePresenterRegistry.get(appId, network) ??
      this.defaultBalancePresenterFactory.build({ appId, network });

    let presentedBalances: TokenBalanceResponse | null = await this.groupMetaProcessor(appId, network, balances);
    presentedBalances ??= await presenter.present(address, balances);
    return presentedBalances;
  }
}
