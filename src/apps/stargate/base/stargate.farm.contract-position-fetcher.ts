import { BigNumberish } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateFarmContractPositionFetcher } from '../common/stargate.farm.contract-position-fetcher';
import { StargateChefBase } from '../contracts/viem';
import { StargateFarmBaseContractPositionFetcher } from '../common/stargate.farm-base.contract-position-fetcher';
import { StargateChefBaseContract } from '../contracts/viem/StargateChefBase';

@PositionTemplate()
export class BaseStargateFarmContractPositionFetcher extends StargateFarmBaseContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x06eb48763f117c7be887296cdcdfad2e4092739c';
  rewardRateUnit = RewardRateUnit.SECOND;

  getStargateChefContract(address: string): StargateChefBaseContract {
    return this.contractFactory.stargateChefBase({ address, network: this.network });
  }

  getStargateTokenAddress(contract: StargateChefBaseContract): Promise<string> {
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
    return contract.read.pendingEmissionToken([BigInt(contractPosition.dataProps.poolIndex), address]).catch(err => {
      if (isViemMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }
}
