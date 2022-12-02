import 'moment-duration-format';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MeanFinanceDcaPositionContractPositionFetcher } from '../common/mean-finance.dca-position.contract-position-fetcher';

@PositionTemplate()
export class OptimismMeanFinanceDcaPositionContractPositionFetcher extends MeanFinanceDcaPositionContractPositionFetcher {
  groupLabel = 'DCA Positions';
  hubs = [
    {
      // Version 2 Hub - VULN
      hubAddress: '0x230c63702d1b5034461ab2ca889a30e343d81349',
      tokenAddress: '0xb4edfb45446c6a207643ea846bfa42021ce5ae11',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-ys-vulnerable-optimism',
    },
    {
      // Version 3 Hub - POST-VULN
      hubAddress: '0x059d306a25c4ce8d7437d25743a8b94520536bd5',
      tokenAddress: '0x6f54391fe0386d506b51d69deeb8b04e0544e088',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-ys-optimism',
    },
    {
      // Version 4 Hub - YIELD
      hubAddress: '0xa43cc0b95ec985bf45fc03262150c20cae180952',
      tokenAddress: '0x516cb11697bf1ba2dbb5c081c23f169791c4bd01',
      transformerAddress: '0xc0136591df365611b1452b5f8823def69ff3a685',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/mean-finance/dca-v2-yf-optimism',
    },
  ];
}
