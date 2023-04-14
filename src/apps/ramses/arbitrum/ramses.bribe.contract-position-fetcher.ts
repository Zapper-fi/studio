import _, { zip } from 'lodash';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
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
  voterAddress = '0xaaa2564deb34763e3d05162ed3f5c2658691f499';

  getContract(address: string): RamsesBribe {
    return this.contractFactory.ramsesBribe({ address, network: this.network });
  }

  async getDefinitions(): Promise<RamsesBribeDefinition[]> {
    const pools = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: ['pool'],
    });

    const multicall = this.appToolkit.getMulticall(this.network);
    const ramsesVoter = this.contractFactory.ramsesVoter({ network: this.network, address: this.voterAddress });

    const gauges = await Promise.all(pools.map(p => multicall.wrap(ramsesVoter).gauges(p.address)));
    const gaugeBribes = await Promise.all(gauges.map(g => multicall.wrap(ramsesVoter).feeDistributers(g)));
    const definitions = zip(pools, gaugeBribes).map(([pool, bribe]) => {
      if (bribe === ZERO_ADDRESS || !pool || !bribe) return null;
      return { address: bribe.toLowerCase(), name: pool.displayProps.label };
    });

    return _.compact(definitions);
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
