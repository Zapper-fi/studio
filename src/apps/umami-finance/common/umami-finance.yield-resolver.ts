import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';

import { getUmamiApiIdFromVaultAddress } from './umami-finance.helpers';

type UmamiStakingMetric = {
  key: 'apy' | 'apr';
  label: string;
  value: string;
  context: string;
};

export type UmamiStakingApiResponse = {
  metrics: Array<UmamiStakingMetric>;
};

export type UmamiVaultApiResponse = {
  liquidApr: number;
  boostedApr: number;
};

@Injectable()
export class UmamiFinanceYieldResolver {
  @Cache({
    key: `studio:umami-finance:marinate`,
    ttl: 5 * 60, // 60 minutes
  })
  async getStakingYield() {
    const { data } = await Axios.get<UmamiStakingApiResponse>(
      `https://api.umami.finance/api/v2/staking/metrics/current?keys=apy&keys=apr`,
    );
    return {
      apy: data.metrics[0].value,
      apr: data.metrics[1].value,
    };
  }

  @Cache({
    key: (vaultAddress: string) => `studio:umami-finance:vault:${vaultAddress}`,
    ttl: 5 * 60, // 60 minutes
  })
  async getVaultYield(vaultAddress: string, isTimelockVault = false): Promise<number> {
    const vaultId = getUmamiApiIdFromVaultAddress(vaultAddress);
    if (vaultId) {
      const { data } = await Axios.get<UmamiVaultApiResponse>(`https://api.umami.finance/api/v2/vaults/${vaultId}`);
      const vaultYield = isTimelockVault ? data.boostedApr : data.liquidApr;

      return vaultYield * 100;
    }
    return 0;
  }
}
