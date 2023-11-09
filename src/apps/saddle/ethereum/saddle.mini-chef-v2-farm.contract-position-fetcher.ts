import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefV2ExtraRewardTokenBalancesParams,
  GetMasterChefV2ExtraRewardTokenRewardRates,
  MasterChefV2TemplateContractPositionFetcher,
} from '~position/template/master-chef-v2.template.contract-position-fetcher';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { SaddleViemContractFactory } from '../contracts';
import { SaddleMiniChefV2 } from '../contracts/viem/SaddleMiniChefV2';
import { SaddleMiniChefV2Rewarder } from '../contracts/viem/SaddleMiniChefV2Rewarder';

@PositionTemplate()
export class EthereumSaddleMiniChefV2FarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  SaddleMiniChefV2,
  SaddleMiniChefV2Rewarder
> {
  groupLabel = 'Farms';
  chefAddress = '0x691ef79e40d909c715be5e9e93738b3ff7d58534';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SaddleViemContractFactory) protected readonly contractFactory: SaddleViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SaddleMiniChefV2 {
    return this.contractFactory.saddleMiniChefV2({ address, network: this.network });
  }

  getExtraRewarderContract(address: string) {
    return this.contractFactory.saddleMiniChefV2Rewarder({ address, network: this.network });
  }

  async getPoolLength(contract: SaddleMiniChefV2) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: SaddleMiniChefV2, poolIndex: number) {
    return contract.lpToken(poolIndex);
  }

  async getRewardTokenAddress(contract: SaddleMiniChefV2) {
    return contract.SADDLE();
  }

  async getExtraRewarder(contract: SaddleMiniChefV2, poolIndex: number) {
    return contract.rewarder(poolIndex);
  }

  async getExtraRewardTokenAddresses(contract: SaddleMiniChefV2Rewarder, poolIndex: number) {
    return contract.pendingTokens(poolIndex, ZERO_ADDRESS, 0).then(v => [v.rewardTokens[0]]);
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<SaddleMiniChefV2>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<SaddleMiniChefV2>) {
    return contract.saddlePerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<SaddleMiniChefV2>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<SaddleMiniChefV2, SaddleMiniChefV2Rewarder>) {
    return rewarderContract.rewardPerSecond().catch(_err => 0);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<SaddleMiniChefV2>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<SaddleMiniChefV2>) {
    return contract.pendingSaddle(contractPosition.dataProps.poolIndex, address);
  }

  async getExtraRewardTokenBalances({
    address,
    rewarderContract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<SaddleMiniChefV2, SaddleMiniChefV2Rewarder>) {
    return rewarderContract
      .pendingTokens(contractPosition.dataProps.poolIndex, address, 0)
      .then(v => v.rewardAmounts[0]);
  }
}
