import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { GetDisplayPropsParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmDataProps } from '~position/template/single-staking.template.contract-position-fetcher';

import { AuraFarmContractPositionFetcher } from '../common/aura.farm.contract-position-fetcher';
import { AuraBaseRewardPool } from '../contracts';

@PositionTemplate()
export class EthereumAuraAuraBalStakingContractPositionFetcher extends AuraFarmContractPositionFetcher {
  groupLabel = 'auraBAL Classic';

  AURA_BAL_STAKING_V1 = '0x5e5ea2048475854a5702f5b8468a51ba1296efcc';
  AURA_BAL_STAKING_V2 = '0x00a7ba8ae7bca0b10a32ea1f8e2a1da980c6cad2';

  getFarmAddresses() {
    return [this.AURA_BAL_STAKING_V1, this.AURA_BAL_STAKING_V2];
  }

  async getTertiaryLabel(params: GetDisplayPropsParams<AuraBaseRewardPool, SingleStakingFarmDataProps>) {
    if (params.definition.address === this.AURA_BAL_STAKING_V1) {
      return `Needs migration`;
    }
    return super.getTertiaryLabel(params);
  }
}
