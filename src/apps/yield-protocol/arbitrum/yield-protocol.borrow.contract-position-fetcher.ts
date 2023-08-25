import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { YieldProtocolBorrowContractPositionFetcher } from '../common/yield-protocol.borrow.contract-position-fetcher';

// TESTTT: 0x35e057137060cd397bd82e3dff54beba480e7012

@PositionTemplate()
export class ArbitrumYieldProtocolBorrowContractPositionFetcher extends YieldProtocolBorrowContractPositionFetcher {
  groupLabel = 'Borrow';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/yieldprotocol/v2-arbitrum?source=zapper';
  cauldronAddress = '0x23cc87fbebdd67cce167fa9ec6ad3b7fe3892e30';
  ladleAddress = '0x16e25cf364cecc305590128335b8f327975d0560';
}
