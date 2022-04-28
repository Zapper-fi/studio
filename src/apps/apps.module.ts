import { readdirSync } from 'fs';

import { IConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import chalk from 'chalk';
import { compact, intersection, uniq } from 'lodash';

import { APP_ID } from '~app/app.decorator';
import { DynamicApps } from '~app/app.dynamic-module';
import { importAppDefinition, importAppModule } from '~app/app.importer';

type ModuleImport = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;

@Module({})
export class AppsModule {
  static isForwardReference(module: ModuleImport): module is ForwardReference {
    return module && !!(module as ForwardReference).forwardRef;
  }

  static isExternallyConfigurable(module: ModuleImport): module is IConfigurableDynamicRootModule<any, any> {
    return module && !!(module as IConfigurableDynamicRootModule<any, any>).externallyConfigured;
  }

  static async externalizeAppModuleDependencies(modules: IConfigurableDynamicRootModule<any, any>[]) {
    modules.forEach(module => {
      const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, module) ?? [];
      const updatedImports = imports.map(v => (this.isExternallyConfigurable(v) ? v.externallyConfigured(v, 0) : v));
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

  static async resolveDependencies(module: ModuleImport) {
    const memory = new Set<ModuleImport>();
    const dependencies = new Set<string>();

    const visit = async (module: ModuleImport) => {
      let moduleClass = module instanceof Promise ? await module : module;
      if (AppsModule.isForwardReference(moduleClass)) {
        moduleClass = moduleClass.forwardRef();
      }

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
      moduleDependencies.forEach(async v => visit(v));
    };

    await visit(module);
    return Array.from(dependencies);
  }

  static async resolveAppModules() {
    // Find all apps available to be registered
    const allAppIds = readdirSync(__dirname, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // If we're in prod, or if there is no enabled apps subset configured, enable everything
    const isProd = process.env.NODE_ENV === 'production';
    const enabledAppIds = compact((process.env.ENABLED_APPS ?? '').split(','));
    if (isProd || !enabledAppIds.length) {
      const appModules = await this.resolveModulesByAppIds(allAppIds);
      return this.externalizeAppModuleDependencies(appModules);
    }

    // Resolve modules, and dependency modules
    const validEnabledAppIds = intersection(enabledAppIds, allAppIds);
    const enabledApps = await this.resolveModulesByAppIds(validEnabledAppIds);
    const enabledDependencies = await Promise.all(enabledApps.map(v => this.resolveDependencies(v)));
    const enabledAppsAndDependencies = await this.resolveModulesByAppIds(uniq(enabledDependencies.flat()));

    return this.externalizeAppModuleDependencies(enabledAppsAndDependencies);
  }

  static async resolveAppHelperModules() {
    // Find all apps available to be registered
    const allAppIds = readdirSync(__dirname, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    // If we're in prod, or if there is no enabled app helpers subset configured, enable nothing
    const isProd = process.env.NODE_ENV === 'production';
    const enabledHelpersAppIds = (process.env.ENABLED_HELPERS ?? '').split(',').filter(Boolean);
    if (isProd || !enabledHelpersAppIds.length) return [];

    // Resolve modules, and dependency modules
    const validEnabledAppIds = intersection(enabledHelpersAppIds, allAppIds);
    const enabledApps = await this.resolveModulesByAppIds(validEnabledAppIds, false);
    const enabledDependencies = await Promise.all(enabledApps.map(v => this.resolveDependencies(v)));
    const enabledAppsAndDependencies = await this.resolveModulesByAppIds(uniq(enabledDependencies.flat()));

    return this.externalizeAppModuleDependencies(enabledAppsAndDependencies);
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
