import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { SolaceXslockerContractPositionFetcher } from '../common/solace.xs-locker.contract-position-fetcher';

@PositionTemplate()
export class AuroraSolaceXslockerContractPositionFetcher extends SolaceXslockerContractPositionFetcher {
  groupLabel = 'xsLocker';
  xsLockerAddress = '0x501ace47c5b0c2099c4464f681c3fa2ecd3146c1';
  stakingRewardAddress = '0x501ace3d42f9c8723b108d4fbe29989060a91411';
}
