import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BancorV3ViemContractFactory } from '../contracts';
import { StandardRewards } from '../contracts/viem';
import { StandardRewardsContract } from '../contracts/viem/StandardRewards';

@PositionTemplate()
export class EthereumBancorV3FarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<StandardRewards> {
  chefAddress = '0xb0b958398abb0b5db4ce4d7598fb868f5a00f372';
  groupLabel = 'Farms';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BancorV3ViemContractFactory) protected readonly contractFactory: BancorV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.standardRewards({ address, network: this.network });
  }

  async getPoolLength(contract: StandardRewardsContract) {
    return contract.read.programIds().then(ids => ids.length);
  }

  async getStakedTokenAddress(contract: StandardRewardsContract, poolIndex: number) {
    return contract.read.programs([[BigInt(poolIndex + 1)]]).then(v => v[0][2]);
  }

  async getRewardTokenAddress(contract: StandardRewardsContract, poolIndex: number) {
    return contract.read.programs([[BigInt(poolIndex + 1)]]).then(v => v[0][3]);
  }

  async getTotalAllocPoints(_params: GetMasterChefDataPropsParams<StandardRewards>) {
    return 1;
  }

  async getTotalRewardRate(_params: GetMasterChefDataPropsParams<StandardRewards>) {
    return 0;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<StandardRewards>) {
    return 0;
  }

  getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StandardRewards>): Promise<BigNumberish> {
    return contract.read.providerStake([address, BigInt(contractPosition.dataProps.poolIndex + 1)]);
  }

  getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<StandardRewards>): Promise<BigNumberish> {
    return contract.read.pendingRewards([address, [BigInt(contractPosition.dataProps.poolIndex + 1)]]);
  }
}
