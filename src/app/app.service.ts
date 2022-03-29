import { Inject, Injectable } from '@nestjs/common';

import { AppRegistry } from './app.registry';

@Injectable()
export class AppService {
  constructor(@Inject(AppRegistry) private readonly appRegistry: AppRegistry) {}

  async getApps() {
    return this.appRegistry.getSupported();
  }

  getApp(appId: string) {
    return this.appRegistry.get(appId);
  }
}
