import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SushiswapBentoboxVaultContractPositionFetcher } from '../common/sushiswap-bentobox.vault.contract-position-fetcher';

@PositionTemplate()
export class PolygonSushiSwapBentoBoxContractPositionFetcher extends SushiswapBentoboxVaultContractPositionFetcher {
  groupLabel = 'BentoBox';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-polygon?source=zapper';
  bentoboxAddress = '0x0319000133d3ada02600f0875d2cf03d442c3367';
}
