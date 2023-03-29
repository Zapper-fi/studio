import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { VelaTokenFarmContractPositionFetcher } from '../common/vela.token-farm.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumVelaVlpFarmContractPositionFetcher extends VelaTokenFarmContractPositionFetcher {
  velaTokenFarmAddress = '0xfc527781ae973f8131dc26dddb2adb080c1c1f59';
}
