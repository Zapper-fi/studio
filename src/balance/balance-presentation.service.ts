import { Inject, Injectable } from '@nestjs/common';
import { get, groupBy } from 'lodash';

import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AppTokenPositionBalance, ContractPositionBalance } from '~position/position-balance.interface';
import { PositionPresenterRegistry } from '~position/position-presenter.registry';
import { PositionGroup } from '~position/template/position-presenter.template';
import { Network } from '~types';

import { TokenBalanceResponse } from './balance-fetcher.interface';
import { BalancePresenterRegistry } from './balance-presenter.registry';
import { DefaultBalancePresenterFactory } from './default.balance-presenter.factory';
import { DefaultPositionPresenterFactory } from './default.position-presenter.factory';

export type PresentParams = {
  appId: string;
  network: Network;
  address: string;
  balances: (AppTokenPositionBalance | ContractPositionBalance)[];
};

@Injectable()
export class BalancePresentationService {
  constructor(
    @Inject(PositionPresenterRegistry) private readonly positionPresenterRegistry: PositionPresenterRegistry,
    @Inject(BalancePresenterRegistry) private readonly balancePresenterRegistry: BalancePresenterRegistry,
    @Inject(DefaultBalancePresenterFactory)
    private readonly defaultBalancePresenterFactory: DefaultBalancePresenterFactory,
    @Inject(DefaultPositionPresenterFactory)
    private readonly defaultPositionPresenterFactory: DefaultPositionPresenterFactory,
  ) {}

  private groupBalancesByPositionGroup(
    balances: (AppTokenPositionBalance | ContractPositionBalance)[],
    positionGroup: PositionGroup,
  ) {
    const getDynamicSelector = (label: string) => {
      const matches = label.match(/{{(.*)}}/);
      if (!matches) return null;
      return matches[1].trim();
    };

    const dynamicLabel = getDynamicSelector(positionGroup.selector);
    if (!dynamicLabel)
      return { [positionGroup.label]: balances.filter(({ groupId }) => positionGroup.groupIds.includes(groupId)) };
    else {
      return groupBy(balances, balance => get(balance, dynamicLabel));
    }
  }

  async present({ appId, address, network, balances }: PresentParams): Promise<TokenBalanceResponse> {
    const presenter =
      this.balancePresenterRegistry.get(appId, network) ??
      this.defaultBalancePresenterFactory.build({ appId, network });

    return presenter.present(address, balances);
  }

  async presentTemplates({ appId, network, balances }: PresentParams): Promise<TokenBalanceResponse> {
    // Use default presenter when no custom presenter
    const customPresenter = this.positionPresenterRegistry.get(appId, network);
    const defaultPresenter = this.defaultPositionPresenterFactory.build({ appId, network });
    if (!customPresenter) return defaultPresenter.presentBalances(balances);

    // When balance product meta resolvers, use default presenter with position groups from either the custom or default presenter
    const positionGroups = customPresenter.getBalanceProductGroups() ?? defaultPresenter.getBalanceProductGroups();
    const balanceProductMetaResolvers = this.positionPresenterRegistry.getBalanceProductMetaResolvers(appId, network);
    if (!balanceProductMetaResolvers) return defaultPresenter.presentBalances(balances, positionGroups);

    // Try to resolve balance product metas, grouping balances by group selector specified in the custom presenter
    const presentedBalances = await Promise.all(
      positionGroups.map(positionGroup => {
        const groupedBalances = this.groupBalancesByPositionGroup(balances, positionGroup);

        return Promise.all(
          // For each computed label group, run the meta resolve if exists
          Object.entries(groupedBalances).map(async ([computedGroupLabel, balances]) => {
            const groupMetaResolver = balanceProductMetaResolvers?.get(positionGroup.selector);
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
}
