import _ from 'lodash';

import { MetadataItemWithLabel, TokenBalanceResponse } from '~balance/balance-fetcher.interface';
import { ContractType } from '~position/contract.interface';
import { AppTokenPositionBalance, ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';

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

type Product = {
  label: string;
  assets: (AppTokenPositionBalance | ContractPositionBalance)[];
  meta?: MetadataItemWithLabel[];
};

export const presentBalanceFetcherResponse = (
  products: Product[],
  meta: MetadataItemWithLabel[] = [],
): TokenBalanceResponse => {
  // Exclude any asset groups that have negligible balances
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
  const metaWithTotals = [...meta, ...totalsMeta];

  return {
    products: productsWithTotals,
    meta: metaWithTotals,
  };
};
