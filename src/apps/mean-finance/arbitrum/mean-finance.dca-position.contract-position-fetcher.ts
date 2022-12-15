import 'moment-duration-format';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MeanFinanceDcaPositionContractPositionFetcher } from '../common/mean-finance.dca-position.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumMeanFinanceDcaPositionContractPositionFetcher extends MeanFinanceDcaPositionContractPositionFetcher {
  groupLabel = 'DCA Positions';
  hubs = [
    {
      // Version 4 Hub - YIELD
      hubAddress: '0xa43cc0b95ec985bf45fc03262150c20cae180952',
      tokenAddress: '0x516cb11697bf1ba2dbb5c081c23f169791c4bd01',
      transformerAddress: '0xc0136591df365611b1452b5f8823def69ff3a685',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-yf-arbitrum',
    },
  ];
}
