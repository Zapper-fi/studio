import _ from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { VotingRewardsContractPositionFetcher } from '../common/ramses.voting-rewards.contract-position-fetcher';
import { RamsesBribe } from '../contracts';

export type RamsesBribeDefinition = {
  address: string;
  name: string;
};

@PositionTemplate()
export class ArbitrumRamsesBribeContractPositionFetcher extends VotingRewardsContractPositionFetcher<RamsesBribe> {
  groupLabel = 'Bribe';

  getContract(address: string): RamsesBribe {
    return this.contractFactory.ramsesBribe({ address, network: this.network });
  }

  async getDefinitions(): Promise<RamsesBribeDefinition[]> {
    return this.definitionsResolver.getBribeDefinitions();
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<RamsesBribe>) {
    const bribeTokens = await contract.getRewardTokens();
    const baseTokens = await this.appToolkit.getBaseTokenPrices(this.network);
    const tokenDefinitions = bribeTokens.map(token => {
      const tokenFound = baseTokens.find(p => p.address === token.toLowerCase());
      if (!tokenFound) return null;
      return {
        metaType: MetaType.CLAIMABLE,
        address: token,
        network: this.network,
      };
    });

    return _.compact(tokenDefinitions);
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<RamsesBribe, DefaultDataProps, RamsesBribeDefinition>): Promise<string> {
    return `${definition.name} Bribe`;
  }
}
