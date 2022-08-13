import fs from 'fs';
import { promisify } from 'util';

import { getAllAppIds } from './common';

const access = promisify(fs.access);

describe('App Assets', () => {
  it.each(getAllAppIds())(`%s has "logo.png"`, async appId => {
    const path = 'src/apps/' + appId + '/assets/logo.png';
    expect(() => access(path)).not.toThrow(`${appId} is missing "logo.png"`);
  });
});
