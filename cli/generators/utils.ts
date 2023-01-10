import { dirname } from 'path';

import { ESLint } from 'eslint';
import fse, { ensureDirSync } from 'fs-extra';
import { resolveConfig, format } from 'prettier';

import { AppDefinitionObject } from '../../src/app/app.interface';

export const loadAppDefinition = async (appId: string) => {
  const modPath = `../src/apps/${appId}/${appId}.definition`;
  const mod = require(modPath);
  const key = Object.keys(mod).find(v => /_DEFINITION/.test(v));
  if (!key) throw new Error(`No matched export found in ${modPath}`);
  return mod[key] as AppDefinitionObject;
};

export const formatAndWrite = async (filename: string, content: string) => {
  ensureDirSync(dirname(filename));

  const eslint = new ESLint({ fix: true });
  const config = await resolveConfig(process.cwd());
  const formatted = format(content, { ...config, parser: 'typescript' });
  fse.writeFileSync(filename, formatted);

  const results = await eslint.lintFiles(filename);
  await ESLint.outputFixes(results);
};
