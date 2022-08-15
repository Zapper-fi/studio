import { execSync } from 'child_process';
import { readdirSync } from 'fs';

import glob from 'glob';
import { uniq } from 'lodash';

import { Network } from '~types';

const getDirectories = (source: string) => {
  const files = readdirSync(source, { withFileTypes: true });
  return files.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
};

export const getAllAppIds = () => {
  const appsDirectoriesRaw = getDirectories('./src/apps');
  const appsDirectories = appsDirectoriesRaw.filter(app => app != '__tests__');
  return appsDirectories;
};

export const getChangedAppIds = () => {
  const res = execSync('git diff origin/main --name-only');
  const changedFiles = res.toString().split('\n');
  const changedAppIds = changedFiles.filter(v => /src\/apps\/.*\//.exec(v)).map(v => v.split('/')[2]);
  return uniq(changedAppIds).filter(app => app != '__tests__');
};

export const getAllAppTokenFetchers = () => {
  return glob
    .sync('./src/apps/**/*.token-fetcher.ts')
    .filter(path => Object.values(Network).includes(path.split('/').at(-2) as Network))
    .map(path => {
      const [network, filename] = path.split('/').slice(-2);
      const [appId, groupId] = filename.split('.');
      return [appId, network, groupId];
    });
};

export const getChangedAppTokenFetchers = () => {
  const changedAppIds = getChangedAppIds();
  const allAppTokenFetchers = getAllAppTokenFetchers();
  return allAppTokenFetchers.filter(v => changedAppIds.includes(v[0]));
};
