import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Network } from '~types';

import { AbracadabraBridgedStakedSpellTokenFetcher } from '../common/abracadabra.bridged-staked-spell.token-fetcher';

import { SPELL_ADDRESS, S_SPELL_ADDRESS } from './abracadabra.arbitrum.constants';

@PositionTemplate()
export class ArbitrumAbracadabraStakedSpellTokenFetcher extends AbracadabraBridgedStakedSpellTokenFetcher {
  groupLabel = 'Staked SPELL';

  vaultAddress = S_SPELL_ADDRESS;
  underlyingTokenAddress = SPELL_ADDRESS;
  fromNetwork = Network.ETHEREUM_MAINNET;
}
