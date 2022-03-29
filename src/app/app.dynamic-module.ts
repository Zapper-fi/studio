import { createConfigurableDynamicRootModule, IConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Type } from '@nestjs/common';

import { APP_TOOLKIT } from '~app-toolkit/app-toolkit.constants';
import { IAppToolkit } from '~app-toolkit/app-toolkit.interface';

export const APP_OPTIONS = 'APP_OPTIONS';
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

export const AbstractDynamicApp = <T>() =>
  createConfigurableDynamicRootModule<T, AppModuleOptions>(APP_OPTIONS, {
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
