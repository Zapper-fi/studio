import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SymphonyYoloContractPositionFetcher } from '../common/symphony.yolo.contract-position-fetcher';

@PositionTemplate()
export class PolygonSymphonyYoloContractPositionFetcher extends SymphonyYoloContractPositionFetcher {
  groupLabel = 'Orders';
  yoloAddress = '0x935b97586fe291750f46bf4ed7beb8e1c3d110a2';
  subgraphUrl = `https://api.thegraph.com/subgraphs/name/symphony-finance/yolo-polygon?source=zapper`;
}
