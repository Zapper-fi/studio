import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PickleViemContractFactory } from '../contracts';
import { PickleJarMasterchef } from '../contracts/viem';

@PositionTemplate()
export class EthereumPickleFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PickleJarMasterchef> {
  groupLabel = 'Farms';
  chefAddress = '0xbd17b1ce622d73bd438b9e658aca5996dc394b0d';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleViemContractFactory) protected readonly contractFactory: PickleViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pickleJarMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: PickleJarMasterChefContract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PickleJarMasterChefContract, poolIndex: number) {
    return contract.read.poolInfo([poolIndex]).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: PickleJarMasterChefContract) {
    return contract.read.pickle();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.read.picklePerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.read.userInfo([contractPosition.dataProps.poolIndex, address]).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.read.pendingPickle([contractPosition.dataProps.poolIndex, address]);
  }
}
