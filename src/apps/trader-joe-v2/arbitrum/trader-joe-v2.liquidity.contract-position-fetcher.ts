import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbstractTraderJoeV2LiquidityContractPositionFetcher } from '../common/trader-joe-v2.liquidity.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumTraderJoeV2LiquidityContractPositionFetcher extends AbstractTraderJoeV2LiquidityContractPositionFetcher {
  subgraphUrl = 'https://thegraph.com/hosted-service/subgraph/traderjoe-xyz/joe-v2-arbitrum';
  factoryAddress = '0x8e42f2f4101563bf679975178e880fd87d3efd4e';
}
