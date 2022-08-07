import querystring from 'node:querystring';

import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';

const BASE_URL = 'https://api.angle.money/v1';

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

type TVaultManager = {
  address: string;
  borrowFee: number;
  collateral: string;
  collateralHasPermit: boolean;
  collateralPermitVersion: string;
  decimals: number;
  dust: number;
  liquidationPenalty: number;
  maxLTV: number;
  minCollateralRatio: number;
  rate: number;
  stabilityFee: number;
  stablecoin: string;
  swapper: string;
  symbol: string;
  totalCollateral: number;
  totalDebt: number;
  treasury: string;
};

type TPerpetual = {
  perpetualID: string;
  owner: string;
  decimals: string;
  margin: string;
  committedAmount: string;
  entryRate: string;
  perpetualManager: string;
  stableAddress: string;
  collatAddress: string;
  stableName: string;
  collatName: string;
  openingTimestamp: string;
  lastUpdateTimestamp: string;
  openingBlockNumber: string;
  lastUpdateBlockNumber: string;
  status: string;
  claimable: number;
};

type TVault = {
  address: string;
  collateral: string;
  collateralAmount: number;
  collateralRatio: number;
  debt: number;
  debtString: string;
  id: number;
  liquidationPrice: number;
  rate: number;
  stablecoin: string;
  symbol: string;
};

@Injectable()
export class AngleApiHelper {
  constructor() {}

  private async callAngleApi<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = `${BASE_URL}/${endpoint}`;
    if (params) {
      url += `?${querystring.stringify(params)}`;
    }
    const data = await Axios.get<T>(url).then(v => v.data);
    return data;
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${ANGLE_DEFINITION.id}:apr:${network}:angle`,
    ttl: 15 * 60,
  })
  async getApr(_network: Network) {
    return this.callAngleApi<Record<string, TAPR>>('apr');
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${ANGLE_DEFINITION.id}:vaultmanagers:${network}:angle`,
    ttl: 15 * 60,
  })
  async getVaultManagers(_network: Network) {
    return this.callAngleApi<Record<string, TVaultManager>>('vaultManagers', { chainId: 1 });
  }

  @Cache({
    instance: 'user',
    key: (network: Network) => `studio:${ANGLE_DEFINITION}:perpetuals:${network}:angle`,
    ttl: 15 * 60,
  })
  async getUserPerpetuals(address: string, _network: Network) {
    return this.callAngleApi<{ perpetuals: TPerpetual[] }>('perpetuals', {
      chainId: 1,
      user: address,
    });
  }

  @Cache({
    instance: 'user',
    key: (network: Network) => `studio:${ANGLE_DEFINITION.id}:vaults:${network}:angle`,
    ttl: 15 * 60,
  })
  async getUserVaults(address: string, _network: Network) {
    return this.callAngleApi<Record<string, TVault>>('vaults', {
      chainId: 1,
      user: address,
    });
  }

  @Cache({
    instance: 'user',
    key: (network: Network) => `studio:${ANGLE_DEFINITION.id}:rewardsdata:${network}:angle`,
    ttl: 30 * 60,
  })
  async getRewardsData(address: string, _network: Network) {
    return this.callAngleApi<{ rewardsData: { totalClaimable: number } }>('dao', {
      chainId: 1,
      user: address,
    });
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:${ANGLE_DEFINITION.id}:tokenlist:${network}:angle`,
    ttl: 60 * 60,
  })
  async fetchTokenList(_network: Network, networkName = 'mainnet') {
    const tokenListEndpoint = 'https://raw.githubusercontent.com/AngleProtocol/angle-token-list/main/ERC20_LIST.json';
    const tokenList = await Axios.get<[{ [network: string]: Record<string, TokenInfo> }]>(tokenListEndpoint).then(
      v => v.data[0][networkName],
    );
    return tokenList;
  }
}
