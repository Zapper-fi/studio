import path from 'path';

import { IConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Type } from '@nestjs/common';

import { AppModuleOptions } from './app.dynamic-module';

type BuildImporterParams = {
  match: RegExp;
  filename: (appId: string) => string;
};

const buildImporter =
  <T>({ match, filename }: BuildImporterParams) =>
  async (appId: string) => {
    const modulePath = path.resolve(__dirname, '../apps', appId, filename(appId));
    const mod = await import(modulePath);
    const key = Object.keys(mod).find(v => match.test(v));
    if (!key) throw new Error(`No matched export found in ${modulePath}`);
    return mod[key] as T;
  };

export const importAppModule = buildImporter<IConfigurableDynamicRootModule<Type, AppModuleOptions>>({
  match: /AppModule$/,
  filename: appId => `${appId}.module`,
});
