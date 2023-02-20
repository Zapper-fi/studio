import { log } from 'console';
import { readdirSync } from 'fs';

import { DynamicModule, Logger, Module, Type } from '@nestjs/common';
import chalk from 'chalk';
import { compact, intersection } from 'lodash';

import { DynamicApps } from '~app/app.dynamic-module';
import { importAppModule } from '~app/app.importer';

@Module({})
export class AppsModule {
  static logger = new Logger(AppsModule.name);

  static async resolveAppModules() {
    // Find all apps available to be registered
    const allAppIds = readdirSync(__dirname, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => !['__tests__'].includes(dirent.name))
      .map(dirent => dirent.name);

    // If we're in prod, or if there is no enabled apps subset configured, enable everything
    const isProdOrTest = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test';
    const configuredAppIds = compact((process.env.ENABLED_APPS ?? '').split(','));

    if (!isProdOrTest && configuredAppIds.length === 0) {
      const message = chalk`{red No apps have been configured! Set {yellow ENABLED_APPS} in your {yellow .env} file, then restart. Example: {yellow ENABLED_APPS=synthetix,uniswap-v2}}`;
      this.logger.error(message);
      process.exit(1);
    }

    const enabledAppIds = isProdOrTest ? allAppIds : intersection(configuredAppIds, allAppIds);
    const appsModules = await Promise.all(enabledAppIds.map(async appId => importAppModule(appId)));
    return compact(appsModules);
  }

  static async registerAsync(opts: { appToolkitModule: Type }): Promise<DynamicModule> {
    const { appToolkitModule } = opts;

    const appModules = await this.resolveAppModules();
    // eslint-disable-next-line no-console
    log(chalk.yellow(`Enabled app modules: ${appModules.map(v => v.name).join(',')}`));

    return {
      module: AppsModule,
      imports: [
        ...DynamicApps({
          apps: [...compact(appModules)],
          imports: [appToolkitModule],
        }),
      ],
    };
  }
}
