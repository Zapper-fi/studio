import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveCryptoPoolTokenFetcher } from '../common/curve.crypto-pool.token-fetcher';

@PositionTemplate()
export class AvalancheCurveCryptoPoolTokenFetcher extends CurveCryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x90f421832199e93d01b64daf378b183809eb0988';
}
