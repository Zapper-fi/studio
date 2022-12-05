import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { AuraFarmContractPositionFetcher } from '../common/aura.farm.contract-position-fetcher';

@PositionTemplate()
export class EthereumAuraAuraBalStakingContractPositionFetcher extends AuraFarmContractPositionFetcher {
  groupLabel = 'auraBAL Staking';

  getFarmAddresses() {
    return ['0x5e5ea2048475854a5702f5b8468a51ba1296efcc'];
  }
}
