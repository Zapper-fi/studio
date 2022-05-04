import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { OlympusBridgeTokenHelper } from '~apps/olympus';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
const network = Network.FANTOM_OPERA_MAINNET;

const ETHEREUM_STAKED_SPELL_ADDRESS = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
const STAKED_SPELL_ADDRESS = '0xbb29d2a58d880af8aa5859e30470134deaf84f2b';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomAbracadabraStakedSpellTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(OlympusBridgeTokenHelper) private readonly bridgeTokenHelper: OlympusBridgeTokenHelper) {}

  async getPositions() {
    return this.bridgeTokenHelper.getPositions({
      src: { network: Network.ETHEREUM_MAINNET, address: ETHEREUM_STAKED_SPELL_ADDRESS },
      dest: { network: Network.FANTOM_OPERA_MAINNET, address: STAKED_SPELL_ADDRESS },
      appId,
      groupId,
    });
  }
}
