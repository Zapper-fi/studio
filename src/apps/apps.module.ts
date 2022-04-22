import { readdirSync } from 'fs';

import { DynamicModule, Module, Type } from '@nestjs/common';
import chalk from 'chalk';
import { compact } from 'lodash';

import { DynamicApps } from '~app/app.dynamic-module';
import { importAppDefinition, importAppModule } from '~app/app.importer';

@Module({})
export class AppsModule {
  static async registerAsync(opts: { appToolkitModule: Type }): Promise<DynamicModule> {
    const { appToolkitModule } = opts;

    // Find all apps available to be registered
    const allAppIds = readdirSync(__dirname, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // Activate only apps that are requested to be active (for focused local dev)
    const enabledAppIds =
      process.env.NODE_ENV === 'production' ? [] : (process.env.ENABLED_APPS ?? '').split(',').filter(Boolean);

    const filteredAppIds = enabledAppIds.length ? allAppIds.filter(appId => enabledAppIds.includes(appId)) : allAppIds;

    // Dynamically import the apps
    const appsModules = await Promise.all(
      filteredAppIds.map(async appId => {
        try {
          const definition = await importAppDefinition(appId);
          if (definition?.deprecated) return null;
        } catch (e) {
          console.error(chalk.yellow(`No definition file found for "${appId}"`));
        }

        // Dynamically import the module
        const klass = await importAppModule(appId);
        return klass;
      }),
    );

    return {
      module: AppsModule,
      imports: [
        ...DynamicApps({
          apps: [...compact(appsModules)],
          imports: [appToolkitModule],
        }),
      ],
    };
  }
}
