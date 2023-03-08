import _, { range } from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { VotingRewardsContractPositionFetcher } from '../common/velodrome.voting-rewards.contract-position-fetcher';
import { VelodromeBribe } from '../contracts';

export type VelodromeBribeDefinition = {
  address: string;
  name: string;
};

@PositionTemplate()
export class OptimismVelodromeBribeContractPositionFetcher extends VotingRewardsContractPositionFetcher<VelodromeBribe> {
  groupLabel = 'Bribe';

  getContract(address: string): VelodromeBribe {
    return this.contractFactory.velodromeBribe({ address, network: this.network });
  }

  async getDefinitions(): Promise<VelodromeBribeDefinition[]> {
    return this.definitionsResolver.getBribeDefinitions();
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<VelodromeBribe>) {
    const numRewards = Number(await contract.rewardsListLength());
    const bribeTokens = await Promise.all(range(numRewards).map(async n => await contract.rewards(n)));
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
  }: GetDisplayPropsParams<VelodromeBribe, DefaultDataProps, VelodromeBribeDefinition>): Promise<string> {
    return `${definition.name} Bribe`;
  }
}
