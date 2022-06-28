import querystring from 'node:querystring';

import Axios from 'axios';

const BASE_URL = 'https://api.angle.money/v1';

export async function callAngleApi<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  let url = `${BASE_URL}/${endpoint}`;
  if (params) {
    url += `?${querystring.stringify(params)}`;
  }
  const data = await Axios.get<T>(url).then(v => v.data);
  return data;
}

type TAPR = {
  value: number;
  address: string;
  details: {
    min: number;
    max: number;
    fees: number;
    interests: number;
  };
};
export async function getApr() {
  return callAngleApi<Record<string, TAPR>>('apr');
}

type TokenInfo = {
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly isSanToken?: boolean;
  readonly useInSwap?: boolean;
  readonly hasPermit?: boolean;
  readonly permitVersion?: string;
  readonly logoURI?: string;
  readonly tags?: string[];
};

export async function fetchTokenList(networkName = 'mainnet') {
  const tokenListEndpoint = 'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/ERC20_LIST.json';
  const tokenList = await Axios.get<[{ [network: string]: Record<string, TokenInfo> }]>(tokenListEndpoint).then(
    v => v.data[0][networkName],
  );
  return tokenList;
}
