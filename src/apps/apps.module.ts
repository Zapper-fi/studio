import { readdirSync } from 'fs';

import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import chalk from 'chalk';
import { compact, intersection, uniq } from 'lodash';

import { APP_ID } from '~app/app.decorator';
import { DynamicApps } from '~app/app.dynamic-module';
import { importAppDefinition, importAppModule } from '~app/app.importer';

// 1. If already `externallyConfigured` in imports, Reflect.getMetadata will fail
// 2. Need to reflect metadata on synchronous app modules to retrieve metadata

type ModuleImport = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;

@Module({})
export class AppsModule {
  static isForwardReference(module: ModuleImport): module is ForwardReference {
    return module && !!(module as ForwardReference).forwardRef;
  }

  static async resolveModulesByAppIds(appIds: string[]) {
    const appsModules = await Promise.all(
      appIds.map(async appId => {
        const definition = await importAppDefinition(appId).catch(() => null);
        if (!definition) console.error(chalk.yellow(`No definition file found for "${appId}"`));
        if (definition?.deprecated) return null;
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

    // Enable all apps in prod, or if no subset is selected in the environment
    const isProd = process.env.NODE_ENV === 'production';
    const enabledAppIds = compact((process.env.ENABLED_APPS ?? '').split(','));
    if (isProd || !enabledAppIds.length) return AppsModule.resolveModulesByAppIds(allAppIds);

    // Resolve modules, and dependency modules
    const validEnabledAppIds = intersection(enabledAppIds, allAppIds);
    const enabledApps = await AppsModule.resolveModulesByAppIds(validEnabledAppIds);
    console.log(enabledApps);
    const enabledDependencies = await Promise.all(enabledApps.map(v => AppsModule.resolveDependencies(v)));
    const enabledAppsAndDependencies = await AppsModule.resolveModulesByAppIds(uniq(enabledDependencies.flat()));

    return enabledAppsAndDependencies;
  }

  static async registerAsync(opts: { appToolkitModule: Type }): Promise<DynamicModule> {
    const { appToolkitModule } = opts;

    console.log('SUP??');
    const appModules = await AppsModule.resolveAppModules();
    console.log('HERE: ', appModules);

    const enabledHelpersAppIds =
      process.env.NODE_ENV === 'production' ? [] : (process.env.ENABLED_HELPERS ?? '').split(',').filter(Boolean);

    console.log('SUP: ', enabledAppIds);

    const helperModules = await Promise.all(
      enabledHelpersAppIds.map(async appId => {
        // Dynamically import the module
        const klass = await importAppModule(appId);
        return klass;
      }),
    );

    // console.log('HI: ', appsModules[0]);
    const test = await AppsModule.visitModule(appsModules[0]);
    // const meta = Reflect.getMetadataKeys(appsModules[0]);
    // const asdf = Reflect.getMetadata('imports', appsModules[0]);
    // const asdf2 = Reflect.getMetadata(APP_ID, appsModules[0]);
    console.log('Resolved dependencies: ', test);

    return {
      module: AppsModule,
      imports: [
        ...DynamicApps({
          apps: [...compact([...appsModules, ...helperModules])],
          imports: [appToolkitModule],
        }),
      ],
    };
  }
}
