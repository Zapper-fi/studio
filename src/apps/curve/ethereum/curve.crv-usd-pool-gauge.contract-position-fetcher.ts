import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveTricryptoPoolGaugeContractPositionFetcher } from '../common/curve.tricrypto-pool-gauge.contract-position-fetcher';

@PositionTemplate()
export class EthereumCurveCrvUsdPoolGaugeContractPositionFetcher extends CurveTricryptoPoolGaugeContractPositionFetcher {
  groupLabel = 'Staking';

  factoryAddress = '0x4f8846ae9380b90d2e71d5e3d042dff3e7ebb40d';
  controllerAddress = '0x2f50d538606fa9edd2b11e2446beb18c9d5846bb';
  crvAddress = '0xd533a949740bb3306d119cc777fa900ba034cd52';
}
