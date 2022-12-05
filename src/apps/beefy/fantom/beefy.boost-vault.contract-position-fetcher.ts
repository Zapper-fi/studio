import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { BeefyBoostVaultContractPositionFetcher } from '../common/beefy.boost-vault.contract-position-fetcher';

@PositionTemplate()
export class FantomBeefyBoostVaultContractPositionFetcher extends BeefyBoostVaultContractPositionFetcher {
  groupLabel = 'Boost Vaults';
}
