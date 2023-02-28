import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EthereumIdleTranchesPoolTokenFetcher } from '../common/idle.tranche.token-fetcher';

@PositionTemplate()
export class EthereumIdleJuniorTranchesPoolTokenFetcher extends EthereumIdleTranchesPoolTokenFetcher {
  groupLabel = 'Junior Tranches';

  async getDefinitions() {
    return this.trancheDefinitionResolver.getJuniorTrancheAddresses(this.network);
  }
}
