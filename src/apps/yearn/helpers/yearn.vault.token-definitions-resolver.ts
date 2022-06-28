import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network, NETWORK_IDS } from '~types/network.interface';

export type YearnVaultData = {
  inception: number;
  icon: string;
  symbol: string;
  tags: string[];
  special?: boolean;
  apy: {
    type: string;
    gross_apr: number;
    net_apy: number;
    fees: {
      performance: number;
      withdrawal: number;
      management: number;
      keep_crv: number;
      cvx_keep_crv: number;
    };
    points: {
      week_ago: number;
      month_ago: number;
      inception: number;
    };
    composite: number;
  };
  address: string;
  endorsed: boolean;
  strategies: {
    name: string;
    address: string;
  }[];
  tvl: {
    totalAssets: number;
    value: string;
    price: number;
  };
  name: string;
  display_name: string;
  updated: number;
  fees: {
    special: {
      keepCrv: number;
    };
    general: {
      withdrawalFee: number;
      performanceFee: number;
    };
  };
  token: {
    name: string;
    icon: string;
    symbol: string;
    address: string;
    display_name: string;
    decimals: number;
  };
  emergencyShutdown?: false;
  decimals: number;
  type: string;
  migration: null | {
    available: boolean;
    address: string;
  };
};

type GetVaultDefinitionsParams = {
  network: Network;
  vaultType: 'v1' | 'v2';
  vaultsToIgnore: string[];
};

@Injectable()
export class YearnVaultTokenDefinitionsResolver {
  @Cache({
    instance: 'business',
    key: network => `studio:yearn:${network}:vault-data`,
    ttl: 5 * 60, // 60 minutes
  })
  private async getVaultDefinitionsData(network: Network) {
    const url = `https://api.yearn.finance/v1/chains/${NETWORK_IDS[network]}/vaults/all`;
    const { data } = await Axios.get<YearnVaultData[]>(url);
    return data;
  }

  async getVaultDefinitions({ network, vaultsToIgnore, vaultType }: GetVaultDefinitionsParams) {
    const definitionsData = await this.getVaultDefinitionsData(network);

    return definitionsData
      .filter(vault => vault.type === 'v1' || !!vault.endorsed) // Remove experimental v2 vaults
      .filter(vault => !vault.special) // Remove "special" vaults
      .filter(vault => !vaultsToIgnore.includes(vault.address.toLowerCase())) // Remove vaults not having the same structure as the other
      .filter(vault => vault.type === vaultType);
  }
}
