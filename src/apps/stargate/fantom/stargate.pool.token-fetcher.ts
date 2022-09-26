import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';

@PositionTemplate()
export class FantomStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  groupLabel = 'Pool';
  factoryAddress = '0x9d1b1669c73b033dfe47ae5a0164ab96df25b944';
  useLocalDecimals = false;
}
