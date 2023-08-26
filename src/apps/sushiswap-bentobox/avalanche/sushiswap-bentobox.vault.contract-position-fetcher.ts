import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SushiswapBentoboxVaultContractPositionFetcher } from '../common/sushiswap-bentobox.vault.contract-position-fetcher';

@PositionTemplate()
export class AvalancheSushiSwapBentoBoxContractPositionFetcher extends SushiswapBentoboxVaultContractPositionFetcher {
  groupLabel = 'BentoBox';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox-avalanche?source=zapper';
  bentoboxAddress = '0x0711b6026068f736bae6b213031fce978d48e026';
}
