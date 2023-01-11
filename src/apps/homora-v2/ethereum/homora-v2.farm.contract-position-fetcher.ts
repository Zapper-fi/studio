import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { HomoraV2FarmContractPositionFetcher } from '../common/homora-v2.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumHomoraV2FarmContractPositionFetcher extends HomoraV2FarmContractPositionFetcher {
  homoraBankAddress = '0xba5ebaf3fc1fcca67147050bf80462393814e54b';

  groupLabel = 'Farms';
}
