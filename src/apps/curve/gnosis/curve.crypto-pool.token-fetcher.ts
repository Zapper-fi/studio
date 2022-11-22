import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { CurveCryptoPoolTokenFetcher } from '../common/curve.crypto-pool.token-fetcher';

@PositionTemplate()
export class GnosisCurveCryptoPoolTokenFetcher extends CurveCryptoPoolTokenFetcher {
  groupLabel = 'Pools';
  registryAddress = '0x8a4694401be8f8fccbc542a3219af1591f87ce17';
}
