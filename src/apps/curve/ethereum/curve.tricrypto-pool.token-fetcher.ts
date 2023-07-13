import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveTricryptoPoolTokenFetcher } from '../common/curve.tricrypto-pool.token-fetcher';

@PositionTemplate()
export class EthereumCurveTricryptoPoolTokenFetcher extends CurveTricryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  factoryAddress = '0x0c0e5f2ff0ff18a3be9b835635039256dc4b4963';
}
