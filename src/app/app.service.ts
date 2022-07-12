import { Inject, Injectable } from '@nestjs/common';

import { AppApiSource } from './app.api';
import { AppRegistry } from './app.registry';

@Injectable()
export class AppService {
  constructor(
    @Inject(AppRegistry) private readonly appRegistry: AppRegistry,
    @Inject(AppApiSource) private readonly appApiSource: AppApiSource,
  ) {}

  getApps() {
    return this.appRegistry.getSupported();
  }

  async getApp(appId: string) {
    return this.appRegistry.get(appId) ?? (await this.appApiSource.get(appId));
  }
}
