import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MeanFinanceDcaPositionContractPositionFetcher } from '../common/mean-finance.dca-position.contract-position-fetcher';

@PositionTemplate()
export class PolygonMeanFinanceDcaPositionContractPositionFetcher extends MeanFinanceDcaPositionContractPositionFetcher {
  groupLabel = 'DCA Positions';
  hubs = [
    {
      // Version 2 Hub - VULN
      hubAddress: '0x230c63702d1b5034461ab2ca889a30e343d81349',
      tokenAddress: '0xb4edfb45446c6a207643ea846bfa42021ce5ae11',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-ys-vulnerable-polygon?source=zapper',
    },
    {
      // Version 3 Hub - POST-VULN
      hubAddress: '0x059d306a25c4ce8d7437d25743a8b94520536bd5',
      tokenAddress: '0x6f54391fe0386d506b51d69deeb8b04e0544e088',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-ys-polygon?source=zapper',
    },
    {
      // Version 4 Hub - YIELD
      hubAddress: '0xa5adc5484f9997fbf7d405b9aa62a7d88883c345',
      tokenAddress: '0x20bdae1413659f47416f769a4b27044946bc9923',
      transformerAddress: '0xc0136591df365611b1452b5f8823def69ff3a685',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-yf-polygon?source=zapper',
    },
  ];
}
