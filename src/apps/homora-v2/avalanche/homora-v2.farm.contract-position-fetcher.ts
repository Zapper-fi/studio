import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { HomoraV2FarmContractPositionFetcher } from '../common/homora-v2.farm.contract-position-fetcher';

@PositionTemplate()
export class AvalancheHomoraV2FarmContractPositionFetcher extends HomoraV2FarmContractPositionFetcher {
  homoraBankAddress = '0x376d16c7de138b01455a51da79ad65806e9cd694';

  groupLabel = 'Farms';
}
