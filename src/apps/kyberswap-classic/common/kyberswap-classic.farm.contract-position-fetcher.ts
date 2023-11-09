import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { KyberswapClassicViemContractFactory } from '../contracts';
import { KyberSwapClassicMasterchef } from '../contracts/viem';

export abstract class KyberSwapClassicFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<KyberSwapClassicMasterchef> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KyberswapClassicViemContractFactory)
    protected readonly contractFactory: KyberswapClassicViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.kyberSwapClassicMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: KyberSwapClassicMasterchef) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: KyberSwapClassicMasterchef, poolIndex: number) {
    return contract.read.getPoolInfo([poolIndex]).then(v => v.stakeToken);
  }

  async getRewardTokenAddress(contract: KyberSwapClassicMasterchef) {
    return contract.read.getRewardTokens().then(v => v[0]);
  }

  async getTotalAllocPoints(_params: GetMasterChefDataPropsParams<KyberSwapClassicMasterchef>) {
    return 1;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<KyberSwapClassicMasterchef>) {
    return 1;
  }

  async getTotalRewardRate({ contract, definition }: GetMasterChefDataPropsParams<KyberSwapClassicMasterchef>) {
    return contract.getPoolInfo(definition.poolIndex).then(v => v.rewardPerBlocks[0]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberSwapClassicMasterchef>) {
    return contract.getUserInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberSwapClassicMasterchef>) {
    return contract.pendingRewards(contractPosition.dataProps.poolIndex, address).then(v => v[0]);
  }
}
