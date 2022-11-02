import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { GroContractFactory, GroLpTokenStaker } from '../contracts';

@PositionTemplate()
export class EthereumGroFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<GroLpTokenStaker> {
  groupLabel = 'Pools';

  chefAddress = '0x2e32bad45a1c29c1ea27cf4dd588df9e68ed376c';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GroContractFactory) private readonly contractFactory: GroContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.groLpTokenStaker({ address, network: this.network });
  }

  async getPoolLength(contract: GroLpTokenStaker): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: GroLpTokenStaker, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: GroLpTokenStaker) {
    return contract.poolInfo(0).then(v => v.lpToken);
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<GroLpTokenStaker>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<GroLpTokenStaker>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<GroLpTokenStaker>): Promise<BigNumberish> {
    return contract.groPerBlock();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<GroLpTokenStaker>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<GroLpTokenStaker>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.rewardDebt);
  }
}
