/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import util from 'util';

import { strings } from '../../strings';

const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);

export const normalizeAbis = async (location: string) => {
  const abisDir = path.join(location, '/contracts/abis');
  await mkdir(abisDir, { recursive: true });

  const abis = (await readdir(abisDir, { withFileTypes: true }))
    .filter(f => f.isFile())
    .filter(f => path.extname(f.name) === '.json')
    .map(f => `${path.basename(f.name, '.json')}.json`);

  for (const abi of abis) {
    const originalPath = path.join(abisDir, abi);
    const nextFilename = strings.kebabCase(abi.replace('.json', ''));
    const nextPath = path.join(abisDir, `${nextFilename}.json`);
    fs.renameSync(originalPath, nextPath);
  }

  return abis;
};
