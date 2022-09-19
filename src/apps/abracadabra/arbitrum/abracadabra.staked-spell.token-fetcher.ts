import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types';

import { AbracadabraBridgedStakedSpellTokenFetcher } from '../common/abracadabra.bridged-staked-spell.token-fetcher';

@PositionTemplate()
export class ArbitrumAbracadabraStakedSpellTokenFetcher extends AbracadabraBridgedStakedSpellTokenFetcher {
  groupLabel = 'Staked SPELL';

  vaultAddress = '0xf7428ffcb2581a2804998efbb036a43255c8a8d3';
  underlyingTokenAddress = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
