import { readdirSync } from 'fs';

import { IConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { DynamicModule, ForwardReference, Logger, Module, Type } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import chalk from 'chalk';
import { compact, intersection } from 'lodash';

import { APP_ID } from '~app/app.decorator';
import { DynamicApps } from '~app/app.dynamic-module';
import { importAppDefinition, importAppModule } from '~app/app.importer';

type ModuleImport = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;

@Module({})
export class AppsModule {
  static logger = new Logger(AppsModule.name);

  static isForwardReference(module: ModuleImport): module is ForwardReference {
    return module && !!(module as ForwardReference).forwardRef;
  }

  static isAppModule(module: ModuleImport) {
    return module && !!Reflect.getMetadata(APP_ID, module);
  }

  static isDynamic(module: ModuleImport): module is IConfigurableDynamicRootModule<any, any> {
    return module && !!(module as IConfigurableDynamicRootModule<any, any>).externallyConfigured;
  }

  static async externalizeAppModuleDependencies(modules: IConfigurableDynamicRootModule<any, any>[]) {
    modules.forEach(module => {
      // Configure dependents of dynamic app modules to resolve the pre-configured instance of that module
      const imports: ModuleImport[] = Reflect.getMetadata(MODULE_METADATA.IMPORTS, module) ?? [];
      const externalize = (v: IConfigurableDynamicRootModule<any, any>) => v.externallyConfigured(v, 0);
      const updatedImports = imports.map(v => (this.isDynamic(v) && this.isAppModule(v) ? externalize(v) : v));
      Reflect.defineMetadata(MODULE_METADATA.IMPORTS, updatedImports, module);
    });

    return modules;
  }

  static async resolveModulesByAppIds(appIds: string[], requireDefinition = true) {
    const appsModules = await Promise.all(
      appIds.map(async appId => {
        if (requireDefinition) {
          const definition = await importAppDefinition(appId).catch(() => null);
          if (!definition) console.error(chalk.yellow(`No definition file found for "${appId}"`));
          if (definition?.deprecated) return null;
        }

        const klass = await importAppModule(appId);
        return klass;
      }),
    );

    return compact(appsModules);
  }

  static async resolveDependencies(appIds: string[]) {
    const memory = new Set<ModuleImport>();
    const dependencies = new Set<string>();

    const visit = async (module: ModuleImport) => {
      let moduleClass = module instanceof Promise ? await module : module;
      if (this.isForwardReference(moduleClass)) moduleClass = moduleClass.forwardRef();

      // If we have already visited this module, ignore it
      if (memory.has(moduleClass)) return;
      memory.add(moduleClass);

      // If this isn't an app module, ignore it
      const appId = Reflect.getMetadata(APP_ID, module);
      if (!appId) return;

      // Add this app ID to the list of resolved dependencies
      dependencies.add(appId);

      // And recursively visit the dependencies
      const moduleDependencies: ModuleImport[] = Reflect.getMetadata(MODULE_METADATA.IMPORTS, module) ?? [];
      await Promise.all(moduleDependencies.map(v => visit(v)));
    };

    const appModules = await this.resolveModulesByAppIds(appIds);
    await Promise.all(appModules.map(v => visit(v)));
    return Array.from(dependencies);
  }

  static async resolveAppModules() {
    // Find all apps available to be registered
    const allAppIds = readdirSync(__dirname, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== '__tests__')
      .map(dirent => dirent.name);

    // If we're in prod, or if there is no enabled apps subset configured, enable everything
    const loadAllApps = process.env.NODE_ENV === 'production';
    if (loadAllApps) {
      const appModules = await this.resolveModulesByAppIds(allAppIds);
      return this.externalizeAppModuleDependencies(appModules);
    }

    // Otherwise, load a subset of the apps
    const configuredAppIds = compact((process.env.ENABLED_APPS ?? '').split(','));
    if (!configuredAppIds.length) {
      const message = chalk`{red No apps have been configured! Set {yellow ENABLED_APPS} in your {yellow .env} file, then restart. Example: {yellow ENABLED_APPS=synthetix,uniswap-v2}}`;
      this.logger.error(message);
      process.exit(1);
    }

    // Resolve enabled app modules and their dependencies
    const enabledAppIds = intersection(configuredAppIds, allAppIds);
    const enabledAppIdsAndDependencies = await this.resolveDependencies(enabledAppIds);
    const enabledApps = await this.resolveModulesByAppIds(enabledAppIdsAndDependencies);

    return this.externalizeAppModuleDependencies(enabledApps);
  }

  static async resolveAppHelperModules() {
    // Find all apps available to be registered
    const allAppIds = readdirSync(__dirname, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // If we're in prod, or if there is no enabled app helpers subset configured, enable nothing
    const isProd = process.env.NODE_ENV === 'production';
    const configuredHelpersAppIds = (process.env.ENABLED_HELPERS ?? '').split(',').filter(Boolean);
    if (isProd || !configuredHelpersAppIds.length) return [];

    // Resolve modules, and dependency modules
    const enabledAppHelperIds = intersection(configuredHelpersAppIds, allAppIds);
    const enabledAppHelperIdsAndDependencies = await this.resolveDependencies(enabledAppHelperIds);
    const enabledAppHelpers = await this.resolveModulesByAppIds(enabledAppHelperIdsAndDependencies, false);

    return this.externalizeAppModuleDependencies(enabledAppHelpers);
  }

  static async registerAsync(opts: { appToolkitModule: Type }): Promise<DynamicModule> {
    const { appToolkitModule } = opts;

    const appModules = await this.resolveAppModules();
    const appHelperModules = await this.resolveAppHelperModules();
    // eslint-disable-next-line no-console
    console.log(chalk.yellow(`Enabled app modules: ${appModules.map(v => v.name).join(',')}`));

    return {
      module: AppsModule,
      imports: [
        ...DynamicApps({
          apps: [...compact([...appModules, ...appHelperModules])],
          imports: [appToolkitModule],
        }),
      ],
    };
  }
}
