import { execSync } from 'child_process';
import { readdirSync } from 'fs';

import { uniq } from 'lodash';

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
