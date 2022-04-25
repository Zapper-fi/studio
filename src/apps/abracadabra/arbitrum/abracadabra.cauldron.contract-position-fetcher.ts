import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronContractPositionHelper } from '../helpers/abracadabra.cauldron.contract-position-helper';

const CAULDRONS = [
  '0xc89958b03a55b5de2221acb25b58b89a000215e6', // ETH
];

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.cauldron.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumAbracadabraCauldronContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(AbracadabraCauldronContractPositionHelper)
    private readonly abracadabraCauldronContractPositionHelper: AbracadabraCauldronContractPositionHelper,
  ) {}

  async getPositions() {
    return this.abracadabraCauldronContractPositionHelper.getContractPositions({
      cauldronAddresses: CAULDRONS,
      network,
      dependencies: [
        { appId: ABRACADABRA_DEFINITION.id, groupIds: [ABRACADABRA_DEFINITION.groups.stakedSpell.id], network },
      ],
    });
  }
}
