import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

import { APP_NAME } from './app-definition.decorator';
import { AppDefinition } from './app.definition';

@Injectable()
export class AppRegistry implements OnModuleInit {
  private registry = new Map<string, AppDefinition & { disabled?: boolean }>();

  constructor(private readonly discoveryService: DiscoveryService) {}

  onModuleInit() {
    const wrappers = this.discoveryService.getProviders();

    wrappers
      .filter(wrapper => wrapper.metatype && Reflect.getMetadata(APP_NAME, wrapper.metatype))
      .forEach(wrapper => {
        const appId = Reflect.getMetadata(APP_NAME, wrapper.metatype);
        if (!this.registry.get(appId)) this.registry.set(appId, wrapper.instance);
      });
  }

  get(appId: string) {
    const app = this.registry.get(appId);
    if (!app) throw new Error('No application registered with id');

    return app;
  }

  getSupported() {
    return Array.from(this.registry.values());
  }
}
