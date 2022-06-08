import Axios from 'axios';

import { Network } from '~types';

const datasourceUrl = 'https://raw.githubusercontent.com/tempus-finance/tempus-pools-config/master/config.json';

export type TempusPool = {
  address: string;
  ammAddress: string;
  yieldsAddress: string;
  principalsAddress: string;
  // Should probably use yieldBearingTokenAddress instead, but that may have dependency issues in the future
  backingTokenAddress: string;
};
type TempusData = {
  tempusPools: TempusPool[];
};
type TempusDataResponse = Record<Network, TempusData>;

export const getTempusData = async (network: string) => {
  const pools = (await Axios.get<TempusDataResponse>(datasourceUrl)).data[network];
  return pools as TempusData;
};
