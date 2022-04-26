import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { OlympusBridgeTokenHelper } from '~apps/olympus';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
const network = Network.ARBITRUM_MAINNET;

const ETHEREUM_STAKED_SPELL_ADDRESS = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
const STAKED_SPELL_ADDRESS = '0xf7428ffcb2581a2804998efbb036a43255c8a8d3';

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumAbracadabraStakedSpellTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(OlympusBridgeTokenHelper) private readonly bridgeTokenHelper: OlympusBridgeTokenHelper) {}

  async getPositions() {
    return this.bridgeTokenHelper.getPositions({
      src: { network: Network.ETHEREUM_MAINNET, address: ETHEREUM_STAKED_SPELL_ADDRESS },
      dest: { network: Network.ARBITRUM_MAINNET, address: STAKED_SPELL_ADDRESS },
      appId,
      groupId,
    });
  }
}
