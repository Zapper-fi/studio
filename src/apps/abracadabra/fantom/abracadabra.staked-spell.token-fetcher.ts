import { Injectable } from '@nestjs/common';

import { Network } from '~types';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraBridgedStakedSpellTokenFetcher } from '../common/abracadabra.bridged-staked-spell.token-fetcher';

@Injectable()
export class FantomAbracadabraStakedSpellTokenFetcher extends AbracadabraBridgedStakedSpellTokenFetcher {
  appId = ABRACADABRA_DEFINITION.id;
  groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
  network = Network.FANTOM_OPERA_MAINNET;
  groupLabel = 'Staked SPELL';

  vaultAddress = '0xbb29d2a58d880af8aa5859e30470134deaf84f2b';
  underlyingTokenAddress = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
