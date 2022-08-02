import fs from 'fs';
import { readdir } from 'fs/promises';
import { promisify } from 'util';

const access = promisify(fs.access);

describe('App Assets', () => {
  it('All apps should have a "logo.png"', async () => {
    const getDirectories = async (source: string) =>
      (await readdir(source, { withFileTypes: true }))
        .filter((dirent: { isDirectory: () => any }) => dirent.isDirectory())
        .map((dirent: { name: any }) => dirent.name);

    const appsDirectoriesRaw = await getDirectories('./src/apps');
    const appsDirectories = appsDirectoriesRaw.filter(app => app != '__tests__');

    const accesses = await Promise.all(
      appsDirectories.map(async app => {
        const path = 'src/apps/' + app + '/assets/logo.png';
        try {
          await access(path);
          return { appId: app, result: true };
        } catch (error) {
          return { appId: app, result: false };
        }
      }),
    );

    const allAppsHaveLogo = accesses.every(acces => acces.result == true);
    const appsWithoutLogo = accesses.filter(x => !x.result).map(x => `"${x.appId}"`);
    expect(allAppsHaveLogo, `${appsWithoutLogo.join(', ')} do not have "logo.png"`).toBeTruthy();
  });
});
