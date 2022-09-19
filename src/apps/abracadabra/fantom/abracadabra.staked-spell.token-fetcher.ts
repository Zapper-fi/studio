import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types';

import { AbracadabraBridgedStakedSpellTokenFetcher } from '../common/abracadabra.bridged-staked-spell.token-fetcher';

@PositionTemplate()
export class FantomAbracadabraStakedSpellTokenFetcher extends AbracadabraBridgedStakedSpellTokenFetcher {
  groupLabel = 'Staked SPELL';

  vaultAddress = '0xbb29d2a58d880af8aa5859e30470134deaf84f2b';
  underlyingTokenAddress = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
