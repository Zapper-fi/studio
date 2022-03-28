import path from 'path';

import { DynamicModule } from '@nestjs/common';

import { AppDefinition } from './app.definition';

const buildImporter =
  <T>({ match, filename }: { match: RegExp; filename: (appId: string) => string }) =>
  async (appId: string) => {
    try {
      const modulePath = path.resolve(__dirname, '../apps', appId, filename(appId));
      const mod = await import(modulePath);
      const key = Object.keys(mod).find(v => match.test(v));
      if (!key) throw new Error(`No matched export found in ${modulePath}`);
      return mod[key] as T;
    } catch (err) {
      return null;
    }
  };

export const importAppModule = buildImporter<DynamicModule>({
  match: /AppModule$/,
  filename: appId => `${appId}.module`,
});

export const importAppDefinition = buildImporter<AppDefinition>({
  match: /_DEFINITION$/,
  filename: appId => `${appId}.definition`,
});
