import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types';

import { AbracadabraBridgedStakedSpellTokenFetcher } from '../common/abracadabra.bridged-staked-spell.token-fetcher';

@PositionTemplate()
export class AvalancheAbracadabraStakedSpellTokenFetcher extends AbracadabraBridgedStakedSpellTokenFetcher {
  groupLabel = 'Staked SPELL';

  vaultAddress = '0x3ee97d514bbef95a2f110e6b9b73824719030f7a';
  underlyingTokenAddress = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
