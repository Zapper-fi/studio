import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { EthereumIdleTranchesPoolTokenFetcher } from '../common/idle.tranche.token-fetcher';

export type IdleAppTokenDefinition = {
  address: string;
  cdoAddress: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumIdleSeniorTranchesPoolTokenFetcher extends EthereumIdleTranchesPoolTokenFetcher {
  groupLabel = 'Senior Tranches';

  async getDefinitions() {
    return this.trancheDefinitionResolver.getSeniorTrancheAddresses(this.network);
  }
}
