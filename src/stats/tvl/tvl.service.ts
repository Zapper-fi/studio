import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance } from 'axios';
import { sumBy } from 'lodash';

import { AppService } from '~app/app.service';
import { ContractType } from '~position/contract.interface';
import { PositionFetcherRegistry } from '~position/position-fetcher.registry';
import { AppTokenPosition } from '~position/position.interface';
import { PositionService } from '~position/position.service';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

type AppTvl = {
  appId: string;
  appName: string;
  network: Network;
  tvl: number;
};

@Injectable()
export class TvlService {
  private readonly axios: AxiosInstance;

  constructor(
    @Inject(AppService) private readonly appService: AppService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(PositionFetcherRegistry) private readonly positionRegistry: PositionFetcherRegistry,
    @Inject(PositionService) private readonly positionService: PositionService,
  ) {
    this.axios = Axios.create({
      baseURL: this.configService.get('zapperApi.url'),
      params: { api_key: this.configService.get('zapperApi.key') },
    });
  }

  private async getTvlFromApi({ appId, network }: { appId: string; network: Network }) {
    try {
      const { data } = await this.axios.get<AppTvl>(`/v1/apps/${appId}/tvl`, {
        params: {
          network,
        },
      });
      return data;
    } catch (e) {
      return undefined;
    }
  }

  private async getTvlFromGroups({ appId, network }: { appId: string; network: Network }) {
    const [{ groupIds: tokenGroupIds }, { groupIds: positionGroupIds }] = this.positionRegistry.getTvlEnabledGroupsIds({
      network,
      appId,
    });

    const [appTokens, allContractPositions] = await Promise.all([
      this.positionService.getAppTokenPositions<{ liquidity?: number }>({ appId, network, groupIds: tokenGroupIds }),
      this.positionService.getAppContractPositions<{ liquidity?: number }>({
        appId,
        network,
        groupIds: positionGroupIds,
      }),
    ]);

    // Remove contract positions that would be double counted
    // i.e: Farms that consist of app tokens already included in the TVL
    const contractPositions = allContractPositions.filter(position => {
      const suppliedTokens = position.tokens.filter(isSupplied);
      const suppliedAppTokens = suppliedTokens.filter((t): t is AppTokenPosition => t.type === ContractType.APP_TOKEN);
      const isDoubleCountedPosition = suppliedAppTokens.find(t => t.appId === appId && t.network === network);
      return !isDoubleCountedPosition;
    });

    const appTokensTvl = sumBy(appTokens, t => t.dataProps.liquidity ?? 0);
    const positionsTvl = sumBy(contractPositions, p => p.dataProps.liquidity ?? 0);
    return appTokensTvl + positionsTvl;
  }

  async getTvl({ appId, network }: { appId: string; network: Network }): Promise<AppTvl> {
    try {
      const app = await this.appService.getApp(appId);
      const appName = app!.name;
      const tvl = await this.getTvlFromGroups({ appId, network });
      return { appId, appName, network, tvl };
    } catch (e) {
      const apiTvl = await this.getTvlFromApi({ appId, network });
      if (!apiTvl) throw new NotFoundException('No TVL registered on Studio and on Zapper API');
      return apiTvl;
    }
  }
}
