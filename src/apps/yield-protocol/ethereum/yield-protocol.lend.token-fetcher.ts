import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YieldProtocolLendTokenFetcher } from '../common/yield-protocol.lend.token-fetcher';

@PositionTemplate()
export class EthereumYieldProtocolLendTokenFetcher extends YieldProtocolLendTokenFetcher {
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/yieldprotocol/v2-mainnet?source=zapper';
  groupLabel = 'Lending';
}
