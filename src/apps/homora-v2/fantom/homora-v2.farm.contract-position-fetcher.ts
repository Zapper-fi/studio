import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { HomoraV2FarmContractPositionFetcher } from '../common/homora-v2.farm.contract-position-fetcher';

@PositionTemplate()
export class FantomHomoraV2FarmContractPositionFetcher extends HomoraV2FarmContractPositionFetcher {
  homoraBankAddress = '0x060e91a44f16dfcc1e2c427a0383596e1d2e886f';

  groupLabel = 'Farms';
}
