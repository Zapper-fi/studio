import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GravitaStabilityPoolContractPositionFetcher } from '../common/gravita.stability-pool.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumGravitaStabilityPoolContractPositionFetcher extends GravitaStabilityPoolContractPositionFetcher {
  stabilityPoolAddress = '0x0a3137e103a8f268fa065f6d5922ed6173b7bdfa';
}
