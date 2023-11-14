import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { VelodromeBribeContractPositionFetcher } from '../common/velodrome.bribe.contract-position-fetcher';
import { VelodromeFees } from '../contracts/viem';
import { VelodromeFeesContractPositionFetcher } from '../common/velodrome.fees.contract-position-fetcher';

export type VelodromeFeesDefinition = {
  address: string;
  name: string;
  poolAddress: string;
};

@PositionTemplate()
export class OptimismVelodromeFeesContractPositionFetcher extends VelodromeFeesContractPositionFetcher {
  groupLabel = 'Fees';

  getContract(address: string) {
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
      { metaType: MetaType.CLAIMABLE, address: await poolContract.read.token0(), network: this.network },
      { metaType: MetaType.CLAIMABLE, address: await poolContract.read.token1(), network: this.network },
    ];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<VelodromeFees, DefaultDataProps, VelodromeFeesDefinition>): Promise<string> {
    return `${definition.name} Fees`;
  }
}
