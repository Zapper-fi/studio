import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SushiSwapBentoBoxContractPositionHelper } from '../helpers/sushiswap-bentobox.vault.contract-position-helper';
import { SUSHISWAP_BENTOBOX_DEFINITION } from '../sushiswap-bentobox.definition';

const appId = SUSHISWAP_BENTOBOX_DEFINITION.id;
const groupId = SUSHISWAP_BENTOBOX_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumSushiSwapBentoBoxContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SushiSwapBentoBoxContractPositionHelper)
    private readonly positionHelper: SushiSwapBentoBoxContractPositionHelper,
  ) {}

  async getPositions() {
    return this.positionHelper.getPositions({
      bentoBoxAddress: '0xf5bce5077908a1b7370b9ae04adc565ebd643966',
      network,
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/sushiswap/bentobox',
      dependencies: [{ appId: 'sushiswap', groupIds: ['x-sushi', 'meowshi'], network }],
    });
  }
}
