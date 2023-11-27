import { BigNumberish } from 'ethers';

import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { StargateLpStakingTimeContractPositionFetcher } from '../common/stargate.farm-time.contract-position-fetcher';
import { StargateChefTime } from '../contracts/viem';
import { StargateChefTimeContract } from '../contracts/viem/StargateChefTime';

@PositionTemplate()
export class OptimismStargateLpStakingContractPositionFetcher extends StargateLpStakingTimeContractPositionFetcher {
  groupLabel = 'Farms';
  chefAddress = '0x4dea9e918c6289a52cd469cac652727b7b412cd2';
  rewardRateUnit = RewardRateUnit.SECOND;

  getStargateChefContract(address: string): StargateChefTimeContract {
    return this.contractFactory.stargateChefTime({ address, network: this.network });
  }

  getStargateTokenAddress(contract: StargateChefTimeContract): Promise<string> {
    return contract.read.eToken();
  }

  getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<StargateChefTime>): Promise<BigNumberish> {
    return contract.read.eTokenPerSecond();
  }

  getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StargateChefTime>): Promise<BigNumberish> {
    return contract.read.pendingEmissionToken([BigInt(contractPosition.dataProps.poolIndex), address]).catch(err => {
      if (isViemMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }
}
