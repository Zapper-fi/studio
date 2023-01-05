import { Dbr } from '../contracts';
import { uniq } from 'lodash';

export const getMarkets = async (dbrContract: Dbr) => {
    const logs = await dbrContract.queryFilter(dbrContract.filters.AddMarket());
    return uniq(logs.map(l => l.args.market));
}