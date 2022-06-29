import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SushiSwapBentoBoxContractPositionHelper } from '../helpers/sushiswap-bentobox.vault.contract-position-helper';
import { SUSHISWAP_BENTOBOX_DEFINITION } from '../sushiswap-bentobox.definition';

const appId = SUSHISWAP_BENTOBOX_DEFINITION.id;
const groupId = SUSHISWAP_BENTOBOX_DEFINITION.groups.vault.id;
const network = Network.POLYGON_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class PolygonSushiSwapBentoBoxContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SushiSwapBentoBoxContractPositionHelper)
    private readonly positionHelper: SushiSwapBentoBoxContractPositionHelper,
  ) {}

  async getPositions() {
    return this.positionHelper.getPositions({
      bentoBoxAddress: '0x0319000133d3ada02600f0875d2cf03d442c3367',
      network,
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/matthewlilley/bentobox-polygon',
      //subgraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-bentobox', - currently failling to sync
    });
  }
}
