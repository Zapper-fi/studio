import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MeanFinanceDcaPositionContractPositionFetcher } from '../common/mean-finance.dca-position.contract-position-fetcher';

@PositionTemplate()
export class EthereumMeanFinanceDcaPositionContractPositionFetcher extends MeanFinanceDcaPositionContractPositionFetcher {
  groupLabel = 'DCA Positions';
  hubs = [
    {
      // Version 4 Hub - YIELD
      hubAddress: '0xA5AdC5484f9997fBF7D405b9AA62A7d88883C345',
      tokenAddress: '0x20bdAE1413659f47416f769a4B27044946bc9923',
      transformerAddress: '0xc0136591df365611b1452b5f8823def69ff3a685',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-yf-ethereum',
    },
  ];
}
