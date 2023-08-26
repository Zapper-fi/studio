import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SymphonyYoloContractPositionFetcher } from '../common/symphony.yolo.contract-position-fetcher';

@PositionTemplate()
export class AvalancheSymphonyYoloContractPositionFetcher extends SymphonyYoloContractPositionFetcher {
  groupLabel = 'Orders';
  yoloAddress = '0x44f91814c5c766e0762c8c23d65759f631c0abbd';
  subgraphUrl = `https://api.thegraph.com/subgraphs/name/symphony-finance/yolo-avalanche?source=zapper`;
}
