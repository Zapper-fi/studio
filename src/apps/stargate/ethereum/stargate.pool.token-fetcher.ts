import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargatePoolTokenFetcher } from '../common/stargate.pool.token-fetcher';

@PositionTemplate()
export class EthereumStargatePoolTokenFetcher extends StargatePoolTokenFetcher {
  groupLabel = 'Pool';
  factoryAddress = '0x06d538690af257da524f25d0cd52fd85b1c2173e';
  useLocalDecimals = false;
}
