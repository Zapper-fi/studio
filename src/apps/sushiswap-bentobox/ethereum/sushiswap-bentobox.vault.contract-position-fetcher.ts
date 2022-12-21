import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SushiswapBentoboxVaultContractPositionFetcher } from '../common/sushiswap-bentobox.vault.contract-position-fetcher';

@PositionTemplate()
export class EthereumSushiSwapBentoBoxContractPositionFetcher extends SushiswapBentoboxVaultContractPositionFetcher {
  groupLabel = 'BentoBox';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox';
  bentoboxAddress = '0xf5bce5077908a1b7370b9ae04adc565ebd643966';
}
