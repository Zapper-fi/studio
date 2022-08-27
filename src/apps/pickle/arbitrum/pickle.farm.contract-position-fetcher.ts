import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import { MasterChefV2TemplateContractPositionFetcher } from '~position/template/master-chef-v2.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleMiniChefV2, PickleRewarder } from '../contracts';
import { PICKLE_DEFINITION } from '../pickle.definition';

const appId = PICKLE_DEFINITION.id;
const groupId = PICKLE_DEFINITION.groups.masterchefV2Farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumPickleFarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  PickleMiniChefV2,
  PickleRewarder
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Farms';
  chefAddress = '0x7ecc7163469f37b777d7b8f45a667314030ace24';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) protected readonly contractFactory: PickleContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PickleMiniChefV2 {
    return this.contractFactory.pickleMiniChefV2({ address, network: this.network });
  }

  getExtraRewarderContract(address: string) {
    return this.contractFactory.pickleRewarder({ address, network: this.network });
  }

  async getPoolLength(contract: PickleMiniChefV2) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: PickleMiniChefV2, poolIndex: number) {
    return contract.lpToken(poolIndex);
  }

  async getRewardTokenAddress(contract: PickleMiniChefV2) {
    return contract.PICKLE();
  }

  async getExtraRewarder(contract: PickleMiniChefV2, poolIndex: number) {
    return contract.rewarder(poolIndex);
  }

  async getExtraRewardTokenAddresses(contract: PickleRewarder, poolIndex: number) {
    return contract.pendingTokens(poolIndex, ZERO_ADDRESS, 0).then(v => [v.rewardTokens[0]]);
  }

  async getTotalAllocPoints(contract: PickleMiniChefV2) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate(contract: PickleMiniChefV2) {
    return contract.picklePerSecond();
  }

  async getPoolAllocPoints(contract: PickleMiniChefV2, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance(address: string, contract: PickleMiniChefV2, poolIndex: number): Promise<BigNumberish> {
    return contract.userInfo(poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance(address: string, contract: PickleMiniChefV2, poolIndex: number): Promise<BigNumberish> {
    return contract.pendingPickle(poolIndex, address);
  }

  async getExtraRewardTokenBalances(
    address: string,
    contract: PickleRewarder,
    poolIndex: number,
  ): Promise<BigNumberish> {
    return contract.pendingTokens(poolIndex, address, 0).then(v => v.rewardAmounts[0]);
  }
}
