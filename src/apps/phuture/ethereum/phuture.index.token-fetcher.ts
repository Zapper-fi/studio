import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { PhutureIndexTokenFetcher } from '../common/phuture.index.token-fetcher';

@PositionTemplate()
export class EthereumPhutureIndexTokenFetcher extends PhutureIndexTokenFetcher {
  groupLabel = 'Indexes';
  managerAddress = '0x632806bf5c8f062932dd121244c9fbe7becb8b48';
  vTokenFactoryAddress = '0x24ad48f31cab5e35d0e9cdfa9213b5451f22fb92';
}
