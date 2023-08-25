import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SushiswapBentoboxVaultContractPositionFetcher } from '../common/sushiswap-bentobox.vault.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainSushiSwapBentoBoxContractPositionFetcher extends SushiswapBentoboxVaultContractPositionFetcher {
  groupLabel = 'BentoBox';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox-bsc?source=zapper';
  bentoboxAddress = '0xf5bce5077908a1b7370b9ae04adc565ebd643966';
}
