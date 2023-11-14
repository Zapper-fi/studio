import _, { range } from 'lodash';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { VotingRewardsContractPositionFetcher } from '../common/velodrome.voting-rewards.contract-position-fetcher';
import { VelodromeV2Bribe } from '../contracts/viem';

@PositionTemplate()
export class OptimismVelodromeV2BribeContractPositionFetcher extends VotingRewardsContractPositionFetcher {
  groupLabel = 'Bribe';

  getContract(address: string) {
    return this.contractFactory.velodromeV2Bribe({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const bribeAddresses = await this.definitionsResolver.getBribeAddresses(this.network);

    return bribeAddresses.map(bribeAddress => {
      return { address: bribeAddress };
    });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<VelodromeV2Bribe>) {
    const numRewards = Number(await contract.read.rewardsListLength());
    const bribeTokens = await Promise.all(range(numRewards).map(async n => await contract.read.rewards([BigInt(n)])));
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

  async getLabel({ contractPosition }: GetDisplayPropsParams<VelodromeV2Bribe>): Promise<string> {
    return contractPosition.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }
}
