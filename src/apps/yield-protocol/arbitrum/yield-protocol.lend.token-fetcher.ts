import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YieldProtocolLendTokenFetcher } from '../common/yield-protocol.lend.token-fetcher';

@PositionTemplate()
export class ArbitrumYieldProtocolLendTokenFetcher extends YieldProtocolLendTokenFetcher {
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/yieldprotocol/v2-arbitrum?source=zapper';
  groupLabel = 'Lending';
}
