import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { KyberDmmContractFactory, KyberDmmMasterchef } from '../contracts';

export abstract class KyberDmmFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<KyberDmmMasterchef> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberDmmContractFactory) protected readonly contractFactory: KyberDmmContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KyberDmmMasterchef {
    return this.contractFactory.kyberDmmMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: KyberDmmMasterchef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: KyberDmmMasterchef, poolIndex: number) {
    return contract.getPoolInfo(poolIndex).then(v => v.stakeToken);
  }

  async getRewardTokenAddress(contract: KyberDmmMasterchef) {
    return contract.getRewardTokens().then(v => v[0]);
  }

  async getTotalAllocPoints(_params: GetMasterChefDataPropsParams<KyberDmmMasterchef>) {
    return 1;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<KyberDmmMasterchef>) {
    return 1;
  }

  async getTotalRewardRate({ contract, definition }: GetMasterChefDataPropsParams<KyberDmmMasterchef>) {
    return contract.getPoolInfo(definition.poolIndex).then(v => v.rewardPerBlocks[0]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberDmmMasterchef>) {
    return contract.getUserInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberDmmMasterchef>) {
    return contract.pendingRewards(contractPosition.dataProps.poolIndex, address).then(v => v[0]);
  }
}
