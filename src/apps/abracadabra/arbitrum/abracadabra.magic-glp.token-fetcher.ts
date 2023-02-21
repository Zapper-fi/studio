import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AbracadabraMagicGlpTokenFetcher } from '../common/abracadabra.magic-glp.token-fetcher';

import { MAGIC_GLP_ADDRESS } from './abracadabra.arbitrum.constants';

@PositionTemplate()
export class ArbitrumAbracadabraMagicGlpTokenFetcher extends AbracadabraMagicGlpTokenFetcher {
  vaultAddress = MAGIC_GLP_ADDRESS;
}
