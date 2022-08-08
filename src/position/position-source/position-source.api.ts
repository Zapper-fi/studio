import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance } from 'axios';
import DataLoader from 'dataloader';
import qs from 'qs';

import { AppTokenSelectorKey } from '~position/app-token-selector.interface';
import { ContractType } from '~position/contract.interface';
import { AbstractPosition, AppTokenPosition, ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types';

import { PositionSource } from './position-source.interface';

@Injectable()
export class ApiPositionSource implements PositionSource {
  private readonly axios: AxiosInstance;
  private readonly tokensDataLoader: DataLoader<AppGroupsDefinition, AppTokenPosition[]>;
  private readonly positionsDataLoader: DataLoader<AppGroupsDefinition, ContractPosition[]>;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.axios = Axios.create({
      baseURL: this.configService.get('zapperApi.url'),
      params: { api_key: this.configService.get('zapperApi.key') },
    });

    const buildBatchFn =
      <T extends AppTokenPosition | ContractPosition>(contractType: ContractType) =>
      async (definitions: AppGroupsDefinition[]) => {
        const pathParam = contractType === ContractType.APP_TOKEN ? 'tokens' : 'contract-positions';
        const query = qs.stringify({ definitions });
        const { data } = await this.axios.get<T[]>(`/v1/positions/${pathParam}?${query}`);

        // Re-group the results
        const result = definitions.map(def =>
          data.filter(
            ({ appId, groupId, network }) =>
              def.appId === appId && def.network === network && def.groupIds.includes(groupId),
          ),
        );

        return result;
      };

    // The dataloaders will batch together requests for app groups, and cache them in memory
    // Note: There is no TTL; these caches are evicted on restarting the dev server
    this.tokensDataLoader = new DataLoader<AppGroupsDefinition, AppTokenPosition[], string>(
      buildBatchFn(ContractType.APP_TOKEN),
      { cacheKeyFn: v => `tokens:${v.network}:${v.appId}:${v.groupIds.join(',')}` },
    );

    this.positionsDataLoader = new DataLoader<AppGroupsDefinition, ContractPosition[], string>(
      buildBatchFn(ContractType.POSITION),
      { cacheKeyFn: v => `contract-positions:${v.network}:${v.appId}:${v.groupIds.join(',')}` },
    );
  }

  async getPositions<T extends AbstractPosition<any>>(
    definitions: AppGroupsDefinition[],
    contractType: ContractType,
  ): Promise<T[]> {
    if (!definitions.length) return [];
    const loader = contractType === ContractType.APP_TOKEN ? this.tokensDataLoader : this.positionsDataLoader;
    const results = await Promise.all(definitions.map(v => loader.load(v))).then(v => v.flat());
    return results as any as T[];
  }

  async getAppTokenBatch(queries: AppTokenSelectorKey[]) {
    const addresses: string[] = [];
    const networks: Network[] = [];

    for (const q of queries) {
      addresses.push(q.address);
      networks.push(q.network);
    }

    const query = qs.stringify({ addresses, networks });
    const { data } = await this.axios.get<(AppTokenPosition | null)[]>(`/v2/app-tokens/batch?${query}`);
    return data;
  }
}
