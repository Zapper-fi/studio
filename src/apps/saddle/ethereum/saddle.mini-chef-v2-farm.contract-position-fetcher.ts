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
import { SaddleMiniChefV2, SaddleMiniChefV2Contract } from '../contracts/viem/SaddleMiniChefV2';
import { SaddleMiniChefV2Rewarder, SaddleMiniChefV2RewarderContract } from '../contracts/viem/SaddleMiniChefV2Rewarder';

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

  getContract(address: string) {
    return this.contractFactory.saddleMiniChefV2({ address, network: this.network });
  }

  getExtraRewarderContract(address: string) {
    return this.contractFactory.saddleMiniChefV2Rewarder({ address, network: this.network });
  }

  async getPoolLength(contract: SaddleMiniChefV2Contract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: SaddleMiniChefV2Contract, poolIndex: number) {
    return contract.read.lpToken([BigInt(poolIndex)]);
  }

  async getRewardTokenAddress(contract: SaddleMiniChefV2Contract) {
    return contract.read.SADDLE();
  }

  async getExtraRewarder(contract: SaddleMiniChefV2Contract, poolIndex: number) {
    return contract.read.rewarder([BigInt(poolIndex)]);
  }

  async getExtraRewardTokenAddresses(contract: SaddleMiniChefV2RewarderContract, poolIndex: number) {
    return contract.read.pendingTokens([BigInt(poolIndex), ZERO_ADDRESS, BigInt(0)]).then(v => [v[0][0]]);
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<SaddleMiniChefV2>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<SaddleMiniChefV2>) {
    return contract.read.saddlePerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<SaddleMiniChefV2>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[2]);
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<SaddleMiniChefV2, SaddleMiniChefV2Rewarder>) {
    return rewarderContract.read.rewardPerSecond().catch(_err => 0);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<SaddleMiniChefV2>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<SaddleMiniChefV2>) {
    return contract.read.pendingSaddle([BigInt(contractPosition.dataProps.poolIndex), address]);
  }

  async getExtraRewardTokenBalances({
    address,
    rewarderContract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<SaddleMiniChefV2, SaddleMiniChefV2Rewarder>) {
    return rewarderContract.read
      .pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address, BigInt(0)])
      .then(v => v[1][0]);
  }
}
