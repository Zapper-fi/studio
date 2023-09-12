import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YieldProtocolBorrowContractPositionFetcher } from '../common/yield-protocol.borrow.contract-position-fetcher';

@PositionTemplate()
export class EthereumYieldProtocolBorrowContractPositionFetcher extends YieldProtocolBorrowContractPositionFetcher {
  groupLabel = 'Borrow';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/yieldprotocol/v2-mainnet?source=zapper';
  cauldronAddress = '0xc88191f8cb8e6d4a668b047c1c8503432c3ca867';
  ladleAddress = '0x6cb18ff2a33e981d1e38a663ca056c0a5265066a';
}
