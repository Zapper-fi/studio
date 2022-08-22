import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { MasterChefTemplateContractPositionFetcher } from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleJarMasterchef } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

const appId = PICKLE_DEFINITION.id;
const groupId = PICKLE_DEFINITION.groups.masterchefFarm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPickleFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PickleJarMasterchef> {
  appId = PICKLE_DEFINITION.id;
  groupId = PICKLE_DEFINITION.groups.masterchefV2Farm.id;
  network = Network.ETHEREUM_MAINNET;
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

  async getTotalAllocPoints(contract: PickleJarMasterchef) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate(contract: PickleJarMasterchef) {
    return contract.picklePerBlock();
  }

  async getPoolAllocPoints(contract: PickleJarMasterchef, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance(
    address: string,
    contract: PickleJarMasterchef,
    poolIndex: number,
  ): Promise<BigNumberish> {
    return contract.userInfo(poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance(
    address: string,
    contract: PickleJarMasterchef,
    poolIndex: number,
  ): Promise<BigNumberish> {
    return contract.pendingPickle(poolIndex, address);
  }
}
