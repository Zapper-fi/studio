import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { OlympusBridgeTokenHelper } from '~apps/olympus';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
const network = Network.AVALANCHE_MAINNET;

const ETHEREUM_STAKED_SPELL_ADDRESS = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
const STAKED_SPELL_ADDRESS = '0x3ee97d514bbef95a2f110e6b9b73824719030f7a';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheAbracadabraStakedSpellTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(OlympusBridgeTokenHelper) private readonly bridgeTokenHelper: OlympusBridgeTokenHelper) {}

  async getPositions() {
    return this.bridgeTokenHelper.getPositions({
      src: { network: Network.ETHEREUM_MAINNET, address: ETHEREUM_STAKED_SPELL_ADDRESS },
      dest: { network: Network.AVALANCHE_MAINNET, address: STAKED_SPELL_ADDRESS },
      appId,
      groupId,
    });
  }
}
