import { readdirSync } from 'fs';

import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { importAppDefinition, importAppModule } from '~app/app.importer';

@Module({})
export class AppsModule {
  static async registerAsync(opts: { enabledAppIds?: string[] } = {}): Promise<DynamicModule> {
    const { enabledAppIds = [] } = opts;

    // Find all apps available to be registered
    const allAppIds = readdirSync(__dirname, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Activate only apps that are requested to be active (for focused local dev)
    const filteredAppIds = enabledAppIds.length ? allAppIds.filter(appId => enabledAppIds.includes(appId)) : allAppIds;

    // Dynamically import the apps
    const appsModules = await Promise.all(
      filteredAppIds.map(async appId => {
        // Do not include any deprecated apps
        const definition = await importAppDefinition(appId);
        if (!definition || definition.deprecated) return null;

        // Dynamically import the module
        const klass = await importAppModule(appId);
        return klass;
      }),
    );

    const validAppsModules = appsModules.filter((m): m is NonNullable<typeof m> => !!m);

    return {
      module: AppsModule,
      imports: [DiscoveryModule, ...validAppsModules],
    };
  }
}
