import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronContractPositionHelper } from '../helpers/abracadabra.cauldron.contract-position-helper';

const CAULDRONS = [
  '0x3cfed0439ab822530b1ffbd19536d897ef30d2a2', // AVAX
  '0x56984f04d2d04b2f63403f0ebedd3487716ba49d', // wMEMO (deprecated)
  '0x3b63f81ad1fc724e44330b4cf5b5b6e355ad964b', // xJOE
  '0x35fa7a723b3b39f15623ff1eb26d8701e7d6bb21', // wMEMO
  '0x95cce62c3ecd9a33090bbf8a9eac50b699b54210', // USDC/AVAX JLP
  '0x0a1e6a80e93e62bd0d3d3bfcf4c362c40fb1cf3d', // USDT/AVAX JLP
  '0x2450bf8e625e98e14884355205af6f97e3e68d07', // MIM/AVAX JLP
  '0xacc6821d0f368b02d223158f8ada4824da9f28e3', // MIM/AVAX SLP
];

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.cauldron.id;
const network = Network.AVALANCHE_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class AvalancheAbracadabraCauldronContractPositionFetcher implements PositionFetcher<ContractPosition> {
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
        // @TODO: Migrate these over
        {
          appId: 'trader-joe',
          groupIds: ['pool', 'x-joe'],
          network,
        },
        { appId: 'wonderland', groupIds: ['w-memo'], network },
        { appId: 'sushiswap', groupIds: ['pool'], network },
      ],
    });
  }
}
