import path from 'path';

import { IConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Type } from '@nestjs/common';
import chalk from 'chalk';

import { AppDefinition } from './app.definition';
import { AppModuleOptions } from './app.dynamic-module';

type BuildImporterParams = {
  match: RegExp;
  filename: (appId: string) => string;
};

const buildImporter =
  <T>({ match, filename }: BuildImporterParams) =>
  async (appId: string) => {
    try {
      const modulePath = path.resolve(__dirname, '../apps', appId, filename(appId));
      const mod = await import(modulePath);
      const key = Object.keys(mod).find(v => match.test(v));
      if (!key) throw new Error(`No matched export found in ${modulePath}`);
      return mod[key] as T;
    } catch (err) {
      // eslint-disable-next-line
      console.error(chalk.red(`Failed to import ${filename(appId)}: ${err.message}`));
      return null;
    }
  };

export const importAppModule = buildImporter<IConfigurableDynamicRootModule<Type, AppModuleOptions>>({
  match: /AppModule$/,
  filename: appId => `${appId}.module`,
});

export const importAppDefinition = buildImporter<AppDefinition>({
  match: /_DEFINITION$/,
  filename: appId => `${appId}.definition`,
});
