import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios, { AxiosInstance } from 'axios';

import { Cache } from '~cache/cache.decorator';

import { AppDefinition } from './app.definition';

@Injectable()
export class AppApiSource {
  private readonly axios: AxiosInstance;

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.axios = Axios.create({
      baseURL: this.configService.get('zapperApi.url'),
      params: { api_key: this.configService.get('zapperApi.key') },
    });
  }

  @Cache({ key: `studio:all-apps`, ttl: 120 })
  async getApps() {
    const { data } = await this.axios.get<AppDefinition[]>(`/v2/apps`);
    return data;
  }

  async get(appId: string) {
    const apps = await this.getApps();
    const app = apps.find(v => v.id === appId);
    return app;
  }
}
