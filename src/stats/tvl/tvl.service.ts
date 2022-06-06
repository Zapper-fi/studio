import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance } from 'axios';

import { AppService } from '~app/app.service';
import { Network } from '~types/network.interface';

import { TvlFetcherRegistry } from './tvl-fetcher.registry';

type AppTvl = {
  appId: string;
  appName: string;
  network: Network;
  tvl: number;
};

@Injectable()
export class TvlService {
  private readonly axios: AxiosInstance;
  private logger = new Logger(TvlService.name);

  constructor(
    @Inject(TvlFetcherRegistry) private readonly tvlFetcherRegistry: TvlFetcherRegistry,
    @Inject(AppService) private readonly appService: AppService,
    @Inject(ConfigService) private readonly configService: ConfigService,
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

  private async getTvlLocally({ appId, network }: { appId: string; network: Network }) {
    const app = this.appService.getApp(appId);
    const tvlFetcher = this.tvlFetcherRegistry.get({ network, appId: app.id });
    const tvl = (await tvlFetcher?.getTvl()) ?? 0;

    return { appId: appId, appName: app.name, network, tvl };
  }

  async getTvl({ appId, network }: { appId: string; network: Network }): Promise<AppTvl> {
    try {
      return await this.getTvlLocally({ appId, network });
    } catch (e) {
      const apiTvl = await this.getTvlFromApi({ appId, network });
      if (!apiTvl) throw new NotFoundException('No TVL registered on Studio and on Zapper API');
      return apiTvl;
    }
  }
}
