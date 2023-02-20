import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PhutureIndexTokenFetcher } from '../common/phuture.index.token-fetcher';

@PositionTemplate()
export class AvalanchePhutureIndexTokenFetcher extends PhutureIndexTokenFetcher {
  groupLabel = 'Indexes';
  managerAddress = '0x48f88a3fe843ccb0b5003e70b4192c1d7448bef0';
  vTokenFactoryAddress = '0xa654211ae2fac7e029df45fcdc0acfa77e174134';
}
