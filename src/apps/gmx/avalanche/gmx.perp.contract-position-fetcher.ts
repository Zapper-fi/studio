import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GmxPerpContractPositionFetcher } from '../common/gmx.perp.contract-position-fetcher';

@PositionTemplate()
export class AvalancheGmxPerpContractPositionFetcher extends GmxPerpContractPositionFetcher {
  groupLabel = 'Perpetuals';
  vaultAddress = '0x9ab2de34a33fb459b538c43f251eb825645e8595';
  usdcAddress = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e';
}
