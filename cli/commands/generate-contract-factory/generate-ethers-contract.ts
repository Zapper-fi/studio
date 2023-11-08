/* eslint no-console: 0 */
import fs from 'fs';
import path from 'path';
import util from 'util';

import { glob, runTypeChain } from 'typechain';

const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rm);
const exists = util.promisify(fs.exists);

export const generateEthersContract = async (location: string) => {
  const providerDir = path.join(location, `/contracts/ethers`);
  const providerDirExists = await exists(providerDir);
  if (providerDirExists) {
    await rmdir(providerDir, { recursive: true });
    await mkdir(providerDir, { recursive: true });
  }

  const cwd = process.cwd();
  const allFiles = glob(cwd, [path.join(location, '/contracts/abis/*.json')]);
  if (!allFiles.length) return;

  await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: providerDir,
    target: 'ethers-v5',
  });
};
