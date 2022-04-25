import { createConfigurableDynamicRootModule, IConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Type } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';

const APP_OPTIONS = 'APP_OPTIONS';
const DYNAMIC_APP_TOOLKIT = Symbol('DYNAMIC_APP_TOOLKIT');

export interface AppModuleOptions {
  appToolkit: IAppToolkit;
}

const DYNAMIC_PROVIDERS = [
  {
    provide: DYNAMIC_APP_TOOLKIT,
    inject: [APP_OPTIONS],
    useFactory: (options: AppModuleOptions) => options.appToolkit,
  },
];

export const AbstractApp = () =>
  createConfigurableDynamicRootModule<Type, AppModuleOptions>(APP_OPTIONS, {
    providers: DYNAMIC_PROVIDERS,
  });

export const DynamicApps = ({
  apps,
  imports,
}: {
  apps: IConfigurableDynamicRootModule<Type, AppModuleOptions>[];
  imports: Type[];
}) =>
  apps.map(app =>
    app.forRootAsync(app, {
      imports,
      inject: [APP_TOOLKIT],
      useFactory: (appToolkit: AppModuleOptions['appToolkit']) => ({
        appToolkit,
      }),
    }),
  );

export const ExternalAppImport = <T extends IConfigurableDynamicRootModule<Type, AppModuleOptions>>(
  ...appModules: T[]
) => appModules.map(appModule => appModule.externallyConfigured(appModule, 0));
