import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { GainsNetworkLockedContractPositionFetcher } from '../common/gains-network.locked.contract-position-fetcher';

@PositionTemplate()
export class PolygonGainsNetworkLockedContractPositionFetcher extends GainsNetworkLockedContractPositionFetcher {
  gTokenAddress = '0x91993f2101cc758d0deb7279d41e880f7defe827';
  gTokenLockedDepositAddress = '0xdd42aa3920c1d5b5fd95055d852135416369bcc1';
}
