import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { HomoraV2FarmContractPositionFetcher } from '../common/homora-v2.farm.contract-position-fetcher';

@PositionTemplate()
export class OptimismHomoraV2FarmContractPositionFetcher extends HomoraV2FarmContractPositionFetcher {
  homoraBankAddress = '0xffa51a5ec855f8e38dd867ba503c454d8bbc5ab9';

  groupLabel = 'Farms';
}
