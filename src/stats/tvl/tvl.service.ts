import { Inject, Injectable } from '@nestjs/common';

import { AppService } from '~app/app.service';
import { Network } from '~types/network.interface';

import { TvlFetcherRegistry } from './tvl-fetcher.registry';

@Injectable()
export class TvlService {
  constructor(
    @Inject(TvlFetcherRegistry) private readonly tvlFetcherRegistry: TvlFetcherRegistry,
    @Inject(AppService) private readonly appService: AppService,
  ) {}

  async getTvl({ appId, network }: { appId: string; network: Network }) {
    const app = this.appService.getApp(appId);
    const tvlFetcher = this.tvlFetcherRegistry.get({ network, appId: app.id });
    const tvl = tvlFetcher ? await tvlFetcher.getTvl() : 0;
    return { appId: appId, appName: app.name, network, tvl };
  }
}
