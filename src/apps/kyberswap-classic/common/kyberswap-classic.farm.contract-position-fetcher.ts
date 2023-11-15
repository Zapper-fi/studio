import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { KyberswapClassicViemContractFactory } from '../contracts';
import { KyberSwapClassicMasterchef } from '../contracts/viem';
import { KyberSwapClassicMasterchefContract } from '../contracts/viem/KyberSwapClassicMasterchef';

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

  async getPoolLength(contract: KyberSwapClassicMasterchefContract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: KyberSwapClassicMasterchefContract, poolIndex: number) {
    return contract.read.getPoolInfo([BigInt(poolIndex)]).then(v => v[1]);
  }

  async getRewardTokenAddress(contract: KyberSwapClassicMasterchefContract) {
    return contract.read.getRewardTokens().then(v => v[0]);
  }

  async getTotalAllocPoints(_params: GetMasterChefDataPropsParams<KyberSwapClassicMasterchef>) {
    return 1;
  }

  async getPoolAllocPoints(_params: GetMasterChefDataPropsParams<KyberSwapClassicMasterchef>) {
    return 1;
  }

  async getTotalRewardRate({ contract, definition }: GetMasterChefDataPropsParams<KyberSwapClassicMasterchef>) {
    return contract.read.getPoolInfo([BigInt(definition.poolIndex)]).then(v => v[5][0]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberSwapClassicMasterchef>) {
    return contract.read.getUserInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<KyberSwapClassicMasterchef>) {
    return contract.read.pendingRewards([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }
}
