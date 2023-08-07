import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveTricryptoPoolGaugeContractPositionFetcher } from '../common/curve.tricrypto-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class EthereumCurveTricryptoPoolGaugeContractPositionFetcher extends CurveTricryptoPoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';

  factoryAddress = '0x0c0e5f2ff0ff18a3be9b835635039256dc4b4963';
  controllerAddress = '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb';
  crvAddress = '0xd533a949740bb3306d119cc777fa900ba034cd52';
}
