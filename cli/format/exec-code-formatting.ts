import { execSync } from 'child_process';

export function execCodeFormatting(location: string) {
  execSync(`eslint --fix ${location}`, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      DEBUG: 'eslint:cli-engine',
    },
  });

  execSync(`prettier --write ${location}`, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}
