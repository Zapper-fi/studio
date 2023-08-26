import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AtlendisV1PoolContractPositionFetcher } from '../common/atlendis-v1.pool.contract-position-fetcher';

@PositionTemplate()
export class PolygonAtlendisV1PoolContractPositionFetcher extends AtlendisV1PoolContractPositionFetcher {
  groupLabel = 'Pools';
  positionManagerAddress = '0x55e4e70a725c1439dac6b9412b71fc8372bd73e9';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/atlendis/atlendis-hosted-service-polygon?source=zapper';
}
