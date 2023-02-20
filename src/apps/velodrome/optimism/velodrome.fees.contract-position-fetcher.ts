import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { VotingRewardsContractPositionFetcher } from '../common/velodrome.voting-rewards.contract-position-fetcher';
import { VelodromeFees } from '../contracts';

export type VelodromeFeesDefinition = {
  address: string;
  name: string;
  poolAddress: string;
};

@PositionTemplate()
export class OptimismVelodromeFeesContractPositionFetcher extends VotingRewardsContractPositionFetcher<VelodromeFees> {
  groupLabel = 'Fees';

  getContract(address: string): VelodromeFees {
    return this.contractFactory.velodromeFees({ address, network: this.network });
  }

  async getDefinitions(): Promise<VelodromeFeesDefinition[]> {
    return this.definitionsResolver.getFeesDefinitions();
  }

  async getTokenDefinitions({
    definition,
    multicall,
  }: GetTokenDefinitionsParams<VelodromeFees, VelodromeFeesDefinition>) {
    const poolContract = multicall.wrap(
      this.contractFactory.velodromePool({ address: definition.poolAddress, network: this.network }),
    );

    return [
      { metaType: MetaType.CLAIMABLE, address: await poolContract.token0(), network: this.network },
      { metaType: MetaType.CLAIMABLE, address: await poolContract.token1(), network: this.network },
    ];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<VelodromeFees, DefaultDataProps, VelodromeFeesDefinition>): Promise<string> {
    return `${definition.name} Fees`;
  }
}
