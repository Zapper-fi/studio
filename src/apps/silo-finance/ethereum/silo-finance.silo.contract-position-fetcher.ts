import { Network } from '~types';

import { SiloFinanceSiloContractPositionFetcher } from '../common/silo-finance.silo.contract-position-fetcher';
import { SiloLens } from '../contracts';

export class EthereumSiloFinanceSiloContractPositionFetcher extends SiloFinanceSiloContractPositionFetcher {
  network = Network.ETHEREUM_MAINNET;

  getSubgraphUrl(): string {
    return 'https://gateway.thegraph.com/api/fbf06f34dad21c4df6a9e1f647ba1d16/deployments/id/QmRMtCkaYsizfmoavcE1ULwc2DkG1GZjXDHTwHjXAAH9sp';
  }

  getSiloLens(): SiloLens {
    return this.siloFinanceContractFactory.siloLens({
      network: this.network,
      address: '0xf12c3758c1ec393704f0db8537ef7f57368d92ea',
    });
  }
}
