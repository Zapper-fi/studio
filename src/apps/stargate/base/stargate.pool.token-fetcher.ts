import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';

@PositionTemplate()
export class BaseStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  groupLabel = 'Pool';
  factoryAddress = '0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6';
  useLocalDecimals = true;
}
