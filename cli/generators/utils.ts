import { dirname } from 'path';

import { ESLint } from 'eslint';
import fse from 'fs-extra';
import prettier from 'prettier';

export const formatAndWrite = async (filename: string, content: string) => {
  fse.ensureDirSync(dirname(filename));

  const eslint = new ESLint({ fix: true });
  const config = await prettier.resolveConfig(process.cwd());
  const formatted = prettier.format(content, { ...config, parser: 'typescript' });
  fse.writeFileSync(filename, formatted);

  const results = await eslint.lintFiles(filename);
  await ESLint.outputFixes(results);
};
