import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AbracadabraMagicApeTokenFetcher } from '../common/abracadabra.magic-ape.token-fetcher';

@PositionTemplate()
export class EthereumAbracadabraMagicApeTokenFetcher extends AbracadabraMagicApeTokenFetcher {
  vaultAddress = '0xf35b31b941d94b249eaded041db1b05b7097feb6';
  magicApeAnnualHarvests = 730;
  magicApeLensAddress = '0xefdac7dd721985b4bd7fede78465fe3525b468fd';
}
