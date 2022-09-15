import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraBridgedStakedSpellTokenFetcher } from '../common/abracadabra.bridged-staked-spell.token-fetcher';

@Injectable()
export class ArbitrumAbracadabraStakedSpellTokenFetcher extends AbracadabraBridgedStakedSpellTokenFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
  network = Network.ARBITRUM_MAINNET;
  groupLabel = 'Staked SPELL';

  vaultAddress = '0xf7428ffcb2581a2804998efbb036a43255c8a8d3';
  underlyingTokenAddress = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
