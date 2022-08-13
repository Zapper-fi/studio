import { readdirSync } from 'fs';

import glob from 'glob';

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

export const getAllAppTokenFetchers = () => {
  return glob
    .sync('./src/apps/**/*.token-fetcher.ts')
    .filter(path => Object.values(Network).includes(path.split('/').at(-2)))
    .map(path => {
      const [network, filename] = path.split('/').slice(-2);
      const [appId, groupId] = filename.split('.');
      return [appId, network, groupId];
    });
};
