import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { DefaultContractPositionDefinition } from '~position/template/contract-position.template.types';

import { ArgoFinancePledgingContractPositionFetcher } from '../common/argo-finance.pledgin.contract-position-fetcher';

@PositionTemplate()
export class CronosArgoFinancePledgingContractPositionFetcher extends ArgoFinancePledgingContractPositionFetcher {
  groupLabel = 'Pledging';

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x1de93ce995d1bc763c2422ba30b1e73de4a45a01' }];
  }

  async getTokenDefinitions() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0xb966b5d6a0fcd5b373b180bbe072bbfbbee10552' }, // xArgo
      { metaType: MetaType.CLAIMABLE, address: '0xb966b5d6a0fcd5b373b180bbe072bbfbbee10552' }, // xArgo
      { metaType: MetaType.CLAIMABLE, address: '0x5c7f8a570d578ed84e63fdfa7b1ee72deae1ae23' }, // wCRO
    ];
  }
}
