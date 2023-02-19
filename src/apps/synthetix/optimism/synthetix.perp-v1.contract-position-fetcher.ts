import { parseBytes32String } from 'ethers/lib/utils';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { gqlFetch } from '~app-toolkit/helpers/the-graph.helper';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';

import { SynthetixPerp } from '../contracts';

import {
  OptimismSynthetixPerpContractPositionFetcher,
  getContractsQuery,
  GetContracts,
} from './synthetix.perp.contract-position-fetcher';

@PositionTemplate()
export class OptimismSynthetixPerpV1ContractPositionFetcher extends OptimismSynthetixPerpContractPositionFetcher {
  groupLabel = 'PerpV1';

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const contractsFromSubgraph = await gqlFetch<GetContracts>({
      endpoint: 'https://api.thegraph.com/subgraphs/name/kwenta/optimism-perps',
      query: getContractsQuery,
    });

    return contractsFromSubgraph.futuresMarkets
      .filter(market => {
        const marketKeyString = parseBytes32String(market.marketKey);
        //v2 marketKey includes 'PERP', v1 doesn't
        return !marketKeyString.includes('PERP');
      })
      .map(futuresMarket => ({ address: futuresMarket.id }));
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SynthetixPerp>): Promise<string> {
    const baseAsset = await this.getBaseAsset({ contractPosition });
    return `${baseAsset}-PERP (v1)`;
  }
}
