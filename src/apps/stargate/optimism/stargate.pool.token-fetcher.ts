import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';

@PositionTemplate()
export class OptimismStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  groupLabel = 'Pool';
  factoryAddress = '0xe3b53af74a4bf62ae5511055290838050bf764df';
  useLocalDecimals = false;
}
