import { uniq } from 'lodash';

import { Dbr } from '../contracts';

export const getMarkets = async (dbrContract: Dbr) => {
  const logs = await dbrContract.queryFilter(dbrContract.filters.AddMarket());
  return uniq(logs.map(l => l.args.market));
};
