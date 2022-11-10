import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { get, groupBy } from 'lodash';

import {
  presentBalanceFetcherResponse,
  Product,
} from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPositionBalance, ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { PositionPresenterRegistry } from '~position/position-presenter.registry';
import { PositionGroup } from '~position/template/position-presenter.template';
import { Network } from '~types';

import { MetadataItemWithLabel, TokenBalanceResponse } from './balance-fetcher.interface';
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
    const getDynamicLabel = (label: string) => {
      const matches = label.match(/{{(.*)}}/);
      if (!matches) return null;
      return matches[1].trim();
    };

    const dynamicLabel = getDynamicLabel(positionGroup.label);
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

    return presenter.present(address, balances).then(foo);
  }

  async presentTemplates({ address, appId, network, balances }: PresentParams): Promise<TokenBalanceResponse> {
    // Use default presenter when no custom presenter
    const customPresenter = this.positionPresenterRegistry.get(appId, network);
    const defaultPresenter = this.defaultPositionPresenterFactory.build({ appId, network });
    if (!customPresenter) return defaultPresenter.presentBalances(balances).then(foo);

    // When balance product meta resolvers, use default presenter with position groups from either the custom or default presenter
    const positionGroups = customPresenter.positionGroups ?? defaultPresenter.getBalanceProductGroups();
    const balanceProductMetaResolvers = this.positionPresenterRegistry.getBalanceProductMetaResolvers(appId, network);
    if (!balanceProductMetaResolvers) return defaultPresenter.presentBalances(balances, positionGroups).then(foo);

    // Try to resolve balance product metas, grouping balances by group selector specified in the custom presenter
    const presentedBalances = await Promise.all(
      positionGroups.map(positionGroup => {
        const groupedBalances = this.groupBalancesByPositionGroup(balances, positionGroup);

        return Promise.all(
          // For each computed label group, run the meta resolve if exists
          Object.entries(groupedBalances).map(async ([computedGroupLabel, balances]) => {
            const groupMetaResolver = balanceProductMetaResolvers?.get(positionGroup.label);
            if (!groupMetaResolver) return { label: computedGroupLabel, assets: balances };
            else {
              const meta = await groupMetaResolver(address, balances);
              return { label: computedGroupLabel, assets: balances, meta };
            }
          }),
        );
      }),
    );

    return foo(presentBalanceFetcherResponse(presentedBalances.flat()));
  }
}

function foo({ products }: { products: Product[] }) {
  const nonZeroBalanceProducts = products
    .map(assetGroup => ({
      ...assetGroup,
      assets: assetGroup.assets.filter(b => !!b).filter(b => Math.abs(b.balanceUSD) >= 0.01),
    }))
    .filter(assetGroup => assetGroup.assets.length > 0);

  // Build totals for each asset group
  const productsWithTotals = nonZeroBalanceProducts.map(assetGroup => ({
    ...assetGroup,
    meta: assetGroup.meta ?? [],
  }));

  const totalsMeta = getTotalsMeta(productsWithTotals.flatMap(assetGroup => assetGroup.assets));
  const metaWithTotals = [...totalsMeta];

  return {
    products: productsWithTotals,
    meta: metaWithTotals,
  };
}

const getTotalsMeta = (balances: (TokenBalance | ContractPositionBalance)[]): MetadataItemWithLabel[] => {
  const filteredBalances = balances.filter(t => Math.abs(t.balanceUSD) >= 0.01);
  let totalAssetUSD = 0;
  let totalDebtUSD = 0;

  for (const balance of filteredBalances) {
    if (balance.type === ContractType.POSITION) {
      const [assets, debts] = _.partition(balance.tokens, t => t.balanceUSD > 0);
      totalAssetUSD += _.sumBy(assets, ({ balanceUSD }) => balanceUSD);
      totalDebtUSD += _.sumBy(debts, ({ balanceUSD }) => balanceUSD);
    } else {
      if (balance.balanceUSD > 0) totalAssetUSD += balance.balanceUSD;
      if (balance.balanceUSD < 0) totalDebtUSD += balance.balanceUSD;
    }
  }

  const totalUSD = totalAssetUSD - Math.abs(totalDebtUSD);

  return [
    {
      label: 'Total',
      value: totalUSD,
      type: 'dollar',
    },
    {
      label: 'Assets',
      value: totalAssetUSD,
      type: 'dollar',
    },
    {
      label: 'Debt',
      value: totalDebtUSD,
      type: 'dollar',
    },
  ];
};
