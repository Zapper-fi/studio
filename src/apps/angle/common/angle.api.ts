import querystring from 'node:querystring';

import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

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
    key: (network: Network) => `studio:angle:apr:${network}:angle`,
    ttl: 15 * 60,
  })
  async getApr(_network: Network) {
    return this.callAngleApi<Record<string, TAPR>>('apr');
  }

  @Cache({
    instance: 'business',
    key: (network: Network) => `studio:angle:vaultmanagers:${network}:angle`,
    ttl: 15 * 60,
  })
  async getVaultManagers(_network: Network) {
    return this.callAngleApi<Record<string, TVaultManager>>('vaultManagers', { chainId: 1 });
  }

  @Cache({
    instance: 'user',
    key: (network: Network) => `studio:angle:vaults:${network}:angle`,
    ttl: 15 * 60,
  })
  async getVaultIds(address: string, _network: Network) {
    const userVaultDataRaw = await this.callAngleApi<Record<string, TVault>>('vaults', {
      chainId: 1,
      user: address,
    });

    return Object.values(userVaultDataRaw).map(userVault => {
      return userVault.id;
    });
  }

  @Cache({
    instance: 'user',
    key: (network: Network) => `studio:angle:rewardsdata:${network}:angle`,
    ttl: 30 * 60,
  })
  async getRewardsData(address: string, _network: Network) {
    return this.callAngleApi<{ rewardsData: { totalClaimable: number } }>('dao', {
      chainId: 1,
      user: address,
    });
  }
}
