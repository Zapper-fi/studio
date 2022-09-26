import fs from 'fs';
import { promisify } from 'util';

import { getAllAppIds } from './common';

const access = promisify(fs.access);

describe('Apps', () => {
  it('should have a "logo.png"', async () => {
    const appIds = getAllAppIds();
    const logoExists = await Promise.all(
      appIds.map(async app => {
        const path = 'src/apps/' + app + '/assets/logo.png';
        return access(path)
          .then(() => true)
          .catch(() => false);
      }),
    );

    const appsMissingLogos = appIds.filter((t, i) => !logoExists[i]);

    expect(appsMissingLogos, `${appsMissingLogos.join(', ')} do not have "logo.png"`).toHaveLength(0);
  });
});
