import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types/network.interface';

import { UNIPILOT_VAULTS, UNIPILOT_VAULTS_POLYGON } from '../graphql/queries';
import { SUBGRAPH_ENDPOINTS } from '../utils/constants';
import { UnipilotVaultDefinition, UnipilotVaultFetcherResponse } from '../utils/generalTypes';

@Injectable()
export class UnipilotVaultDefinitionsResolver {
  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  @Cache({
    key: network => `studio:unipilot:${network}:pool-data-definitions`,
    ttl: 5 * 60, // 5 minutes
  })
  private async getVaultDefinitionsData(network: Network) {
    const Query = network === Network.ETHEREUM_MAINNET ? UNIPILOT_VAULTS : UNIPILOT_VAULTS_POLYGON;

    const data = await this.appToolkit.helpers.theGraphHelper.request<UnipilotVaultFetcherResponse>({
      endpoint: SUBGRAPH_ENDPOINTS[network].stats,
      query: Query,
      variables: {
        first: 1000,
      },
    });

    return data.vaults;
  }

  async getVaultDefinitions(network: Network): Promise<UnipilotVaultDefinition[]> {
    const vaultsDefinitionsData = await this.getVaultDefinitionsData(network);

    const vaultsDefinitions = vaultsDefinitionsData.map(vault => {
      return {
        address: vault.id,
        token0Address: vault.token0.id,
        token1Address: vault.token1.id,
        feeTier: vault.feeTier,
        token0Symbol: vault.token0.symbol,
        token1Symbol: vault.token1.symbol,
        strategyId: vault.strategyId,
        totalLockedToken0: vault.totalLockedToken0,
        totalLockedToken1: vault.totalLockedToken1,
      };
    });

    return vaultsDefinitions;
  }
}
