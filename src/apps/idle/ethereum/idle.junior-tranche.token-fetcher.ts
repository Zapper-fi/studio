import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EthereumIdleTranchesPoolTokenFetcher } from '../common/idle.tranche.token-fetcher';

export type IdleAppTokenDefinition = {
  address: string;
  cdoAddress: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumIdleJuniorTranchesPoolTokenFetcher extends EthereumIdleTranchesPoolTokenFetcher {
  groupLabel = 'Junior Tranches';

  async getDefinitions() {
    return this.trancheDefinitionResolver.getJuniorTrancheAddresses(this.network);
  }
}
