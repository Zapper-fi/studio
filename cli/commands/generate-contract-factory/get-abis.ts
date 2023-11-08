/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import util from 'util';

import { kebabCase } from 'lodash';

const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);

export const getAbis = async (location: string) => {
  const abisDir = path.join(location, '/contracts/abis');
  await mkdir(abisDir, { recursive: true });

  const abis = (await readdir(abisDir, { withFileTypes: true }))
    .filter(f => f.isFile())
    .filter(f => path.extname(f.name) === '.json')
    .map(f => path.basename(f.name, '.json'))
    .filter(f => kebabCase(f) === f);

  return abis;
};
