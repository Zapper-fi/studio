import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { TeahouseVaultsTokenFetcher } from '../common/teahouse.vaults.token-fetcher';

@PositionTemplate()
export class OptimismTeahouseVaultsTokenFetcher extends TeahouseVaultsTokenFetcher {
  groupLabel = 'Vault share';

  queryFilterFromBlock = 53274656;

  async getAddresses() {
    return ['0x9ae039f9de94542f6f1b3fba60223e6aa4f411af', '0xee1e02609a480bdc9d9651c200d90222b6691f03'];
  }
}
