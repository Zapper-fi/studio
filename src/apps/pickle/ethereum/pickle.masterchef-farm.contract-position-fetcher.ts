import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PickleContractFactory, PickleJarMasterchef } from '../contracts';

@PositionTemplate()
export class EthereumPickleFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PickleJarMasterchef> {
  groupLabel = 'Farms';
  chefAddress = '0xbd17b1ce622d73bd438b9e658aca5996dc394b0d';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) protected readonly contractFactory: PickleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PickleJarMasterchef {
    return this.contractFactory.pickleJarMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: PickleJarMasterchef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: PickleJarMasterchef, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: PickleJarMasterchef) {
    return contract.pickle();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.picklePerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PickleJarMasterchef>): Promise<BigNumberish> {
    return contract.pendingPickle(contractPosition.dataProps.poolIndex, address);
  }
}
