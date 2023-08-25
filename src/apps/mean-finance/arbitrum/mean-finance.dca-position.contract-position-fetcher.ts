import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MeanFinanceDcaPositionContractPositionFetcher } from '../common/mean-finance.dca-position.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumMeanFinanceDcaPositionContractPositionFetcher extends MeanFinanceDcaPositionContractPositionFetcher {
  groupLabel = 'DCA Positions';
  hubs = [
    {
      // Version 4 Hub - YIELD
      hubAddress: '0xa5adc5484f9997fbf7d405b9aa62a7d88883c345',
      tokenAddress: '0x20bdae1413659f47416f769a4b27044946bc9923',
      transformerAddress: '0xc0136591df365611b1452b5f8823def69ff3a685',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-yf-arbitrum?source=zapper',
    },
  ];
}
