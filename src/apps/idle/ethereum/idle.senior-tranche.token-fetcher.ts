import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EthereumIdleTranchesPoolTokenFetcher } from '../common/idle.tranche.token-fetcher';

@PositionTemplate()
export class EthereumIdleSeniorTranchesPoolTokenFetcher extends EthereumIdleTranchesPoolTokenFetcher {
  groupLabel = 'Senior Tranches';

  async getDefinitions() {
    return this.trancheDefinitionResolver.getSeniorTrancheAddresses(this.network);
  }
}
