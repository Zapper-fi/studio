import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';

@PositionTemplate()
export class BinanceSmartChainStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddresses = ['0x3052a0f6ab15b4ae1df39962d5ddefaca86dab47'];
}
