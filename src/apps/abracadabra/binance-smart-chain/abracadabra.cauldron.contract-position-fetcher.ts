import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronContractPositionHelper } from '../helpers/abracadabra.cauldron.contract-position-helper';

const CAULDRONS = [
  '0x692cf15f80415d83e8c0e139cabcda67fcc12c90', // wBNB
  '0xf8049467f3a9d50176f4816b20cddd9bb8a93319', // CAKE
];

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.cauldron.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainAbracadabraCauldronContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
