import { OptimismKwentaPerpContractPositionFetcher } from './kwenta.perp.contract-position-fetcher';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import KWENTA_DEFINITION from '../kwenta.definition';

@PositionTemplate()
export class OptimismKwentaIsolatedContractPositionFetcher extends OptimismKwentaPerpContractPositionFetcher {

  groupLabel = 'Isolated Margin';

  getAccountAddress(address: string): string {
    return address;
  }

}
