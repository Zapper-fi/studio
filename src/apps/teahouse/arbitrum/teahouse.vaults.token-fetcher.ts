import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { TeahouseVaultsTokenFetcher } from '../common/teahouse.vaults.token-fetcher';

@PositionTemplate()
export class ArbitrumTeahouseVaultsTokenFetcher extends TeahouseVaultsTokenFetcher {
  groupLabel = 'Vault share';

  queryFilterFromBlock = 84086498;

  async getAddresses() {
    return ['0x9f4fff022ebff0cbfa3faf702911d0f658a4ba9b'];
  }
}
