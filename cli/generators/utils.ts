import { dirname } from 'path';

import { ESLint } from 'eslint';
import fse, { ensureDirSync } from 'fs-extra';
import { resolveConfig, format } from 'prettier';

import { Network } from '../../src/types/network.interface';

export const formatAndWrite = async (filename: string, content: string) => {
  ensureDirSync(dirname(filename));

  const eslint = new ESLint({ fix: true });
  const config = await resolveConfig(process.cwd());
  const formatted = format(content, { ...config, parser: 'typescript' });
  fse.writeFileSync(filename, formatted);

  const results = await eslint.lintFiles(filename);
  await ESLint.outputFixes(results);
};

export const resolveNetworks = (appId: string) => {
  const networks = fse
    .readdirSync(`./src/apps/${appId}`)
    .filter(file => fse.statSync(`${location}/${file}`).isDirectory())
    .filter((file): file is Network => Object.values(Network).includes(file as Network));
  return networks;
};
