import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GainsNetworkLockedContractPositionFetcher } from '../common/gains-network.locked.contract-position-fetcher';

@PositionTemplate()
export class ArbitrumGainsNetworkLockedContractPositionFetcher extends GainsNetworkLockedContractPositionFetcher {
  gTokenAddress = '0xd85e038593d7a098614721eae955ec2022b9b91b';
  gTokenLockedDepositAddress = '0x673cf5ab7b44caac43c80de5b99a37ed5b3e4cc6';
}
