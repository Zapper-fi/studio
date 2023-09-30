import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GravitaStabilityPoolContractPositionFetcher } from '../common/gravita.stability-pool.contract-position-fetcher';

@PositionTemplate()
export class EthereumGravitaStabilityPoolContractPositionFetcher extends GravitaStabilityPoolContractPositionFetcher {
  stabilityPoolAddress = '0x4f39f12064d83f6dd7a2bdb0d53af8be560356a6';
}
