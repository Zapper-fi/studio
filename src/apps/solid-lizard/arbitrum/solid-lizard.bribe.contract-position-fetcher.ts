import _, { range } from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { VotingRewardsContractPositionFetcher } from '../common/solid-lizard.voting-rewards.contract-position-fetcher';
import { SolidLizardBribe } from '../contracts/viem';

export type SolidLizardBribeDefinition = {
  address: string;
  name: string;
};

@PositionTemplate()
export class ArbitrumSolidLizardBribeContractPositionFetcher extends VotingRewardsContractPositionFetcher {
  groupLabel = 'Bribe';

  getContract(address: string) {
    return this.contractFactory.solidLizardBribe({ address, network: this.network });
  }

  async getDefinitions(): Promise<SolidLizardBribeDefinition[]> {
    return this.definitionsResolver.getBribeDefinitions();
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<SolidLizardBribe>) {
    const numRewards = Number(await contract.read.rewardTokensLength());
    const bribeTokens = await Promise.all(
      range(numRewards).map(async n => await contract.read.rewardTokens([BigInt(n)])),
    );
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
  }: GetDisplayPropsParams<SolidLizardBribe, DefaultDataProps, SolidLizardBribeDefinition>): Promise<string> {
    return `${definition.name} Bribe`;
  }
}
