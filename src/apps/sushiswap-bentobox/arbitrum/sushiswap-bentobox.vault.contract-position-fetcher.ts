import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SushiswapBentoboxVaultContractPositionFetcher } from '../common/sushiswap-bentobox.vault.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumSushiSwapBentoBoxContractPositionFetcher extends SushiswapBentoboxVaultContractPositionFetcher {
  groupLabel = 'BentoBox';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox-arbitrum?source=zapper';
  bentoboxAddress = '0x74c764d41b77dbbb4fe771dab1939b00b146894a';
}
