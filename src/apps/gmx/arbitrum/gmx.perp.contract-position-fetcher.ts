import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GmxPerpContractPositionFetcher } from '../common/gmx.perp.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumGmxPerpContractPositionFetcher extends GmxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  vaultAddress = '0x489ee077994b6658eafa855c308275ead8097c4a';
  usdcAddress = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
}
