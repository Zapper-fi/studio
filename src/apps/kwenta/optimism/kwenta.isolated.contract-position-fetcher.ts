import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { OptimismKwentaPerpContractPositionFetcher } from '../common/kwenta.perp.contract-position-fetcher';

@PositionTemplate()
export class OptimismKwentaIsolatedContractPositionFetcher extends OptimismKwentaPerpContractPositionFetcher {
  groupLabel = 'Isolated Margin';

  getAccountAddress(address: string): string {
    return address;
  }
}
