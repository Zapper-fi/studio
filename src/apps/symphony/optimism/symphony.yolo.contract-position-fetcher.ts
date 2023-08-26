import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SymphonyYoloContractPositionFetcher } from '../common/symphony.yolo.contract-position-fetcher';

@PositionTemplate()
export class OptimismSymphonyYoloContractPositionFetcher extends SymphonyYoloContractPositionFetcher {
  groupLabel = 'Orders';
  yoloAddress = '0x3ff61f4d7e1d912ca3cb342581b2e764ae24d017';
  subgraphUrl = `https://api.thegraph.com/subgraphs/name/symphony-finance/yolo-optimism?source=zapper`;
}
