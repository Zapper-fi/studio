import { Network } from '~types';

import { SiloFinanceSiloContractPositionFetcher } from '../common/silo-finance.silo.contract-position-fetcher';
import { SiloLens } from '../contracts';

export class ArbitrumSiloFinanceSiloContractPositionFetcher extends SiloFinanceSiloContractPositionFetcher {
  network = Network.ARBITRUM_MAINNET;

  getSubgraphUrl(): string {
    return 'https://api.thegraph.com/subgraphs/name/siros-ena/silo-finance-arbitrum-alt';
  }

  getSiloLens(): SiloLens {
    return this.siloFinanceContractFactory.siloLens({
      network: this.network,
      address: '0x2dd3fb3d8aabdeca8571bf5d5cc2969cb563a6e9',
    });
  }
}
