import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import VAPORWAVE_FINANCE_DEFINITION from '../vaporwave-finance.definition';

type VaporwaveFinanceVaultResponse = {
  id: string;
  name: string;
  tokenAddress: string;
  earnContractAddress: string;
  status: string;
};

@Injectable()
export class VaporwaveFinanceVaultDefinitionsResolver {
  @Cache({
    key: `studio:${VAPORWAVE_FINANCE_DEFINITION.id}:${Network.AURORA_MAINNET}:vault-data`,
    ttl: 5 * 60,
  })
  private async getVaultDefinitionsData() {
    const { data } = await Axios.get<VaporwaveFinanceVaultResponse[]>(`https://api.vaporwave.farm/vaults`);
    return data;
  }

  @Cache({
    key: `studio:${VAPORWAVE_FINANCE_DEFINITION.id}:${Network.AURORA_MAINNET}:vault-apy-data`,
    ttl: 5 * 60,
  })
  private async getVaultApyData() {
    const { data } = await Axios.get(`https://api.vaporwave.farm/apy`);
    return data;
  }

  async getVaultDefinitions() {
    const definitionsDataRaw = await this.getVaultDefinitionsData();
    const definitionsData = definitionsDataRaw.filter(x => x.status == 'active' && x.tokenAddress);

    const VaultDefinitions = definitionsData.map(t => {
      return {
        address: t.earnContractAddress.toLowerCase(),
        underlyingTokenAddress: t.tokenAddress.toLowerCase(),
        name: t.name,
        id: t.id,
      };
    });

    return VaultDefinitions;
  }

  async getVaultApy(id: string) {
    const vaultsApy = await this.getVaultApyData();

    return vaultsApy[id];
  }
}
