import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AelinPoolTokenFetcher } from '../common/aelin.pool.token-fetcher';

@PositionTemplate()
export class EthereumAelinPoolTokenFetcher extends AelinPoolTokenFetcher {
  groupLabel = 'Pools';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/aelin-xyz/aelin-mainnet?source=zapper';
}
