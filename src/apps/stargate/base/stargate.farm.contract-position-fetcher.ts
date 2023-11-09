import { BigNumberish } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isMulticallUnderlyingError } from '~multicall/impl/multicall.ethers';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { StargateChefBase } from '../contracts';

@PositionTemplate()
export class BaseStargateFarmContractPositionFetcher extends StargateFarmContractPositionFetcher<StargateChefBase> {
  groupLabel = 'Farms';
  chefAddress = '0x06eb48763f117c7be887296cdcdfad2e4092739c';
  rewardRateUnit = RewardRateUnit.SECOND;

  getStargateChefContract(address: string): StargateChefBase {
    return this.contractFactory.stargateChefBase({ address, network: this.network });
  }

  getStargateTokenAddress(contract: StargateChefBase): Promise<string> {
    return contract.read.eToken();
  }

  getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StargateChefBase>): Promise<BigNumberish> {
    return contract.read.eTokenPerSecond();
  }

  getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StargateChefBase>): Promise<BigNumberish> {
    return contract.read.pendingEmissionToken([contractPosition.dataProps.poolIndex, address]).catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }
}
