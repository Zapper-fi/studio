import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';

@PositionTemplate()
export class AvalancheStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddresses = ['0x8731d54e9d02c286767d56ac03e8037c07e01e98'];
}
