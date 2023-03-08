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
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { TrisolarisMasterChef, TrisolarisRewarder, TrisolarisContractFactory } from '../contracts';

@PositionTemplate()
export class AuroraTrisolarisFarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  TrisolarisMasterChef,
  TrisolarisRewarder
> {
  groupLabel = 'Farms';
  chefAddress = '0x3838956710bcc9d122dd23863a0549ca8d5675d6';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TrisolarisContractFactory) protected readonly contractFactory: TrisolarisContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TrisolarisMasterChef {
    return this.contractFactory.trisolarisMasterChef({ address, network: this.network });
  }

  getExtraRewarderContract(address: string): TrisolarisRewarder {
    return this.contractFactory.trisolarisRewarder({ address, network: this.network });
  }

  async getPoolLength(contract: TrisolarisMasterChef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: TrisolarisMasterChef, poolIndex: number) {
    return contract.lpToken(poolIndex);
  }

  async getRewardTokenAddress(contract: TrisolarisMasterChef) {
    return contract.TRI();
  }

  async getExtraRewarder(contract: TrisolarisMasterChef, poolIndex: number) {
    return contract.rewarder(poolIndex);
  }

  async getExtraRewardTokenAddresses(contract: TrisolarisRewarder, poolIndex: number) {
    return contract.pendingTokens(poolIndex, ZERO_ADDRESS, 0).then(v => [v.rewardTokens[0]]);
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<TrisolarisMasterChef>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TrisolarisMasterChef>) {
    return contract.triPerBlock();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<TrisolarisMasterChef>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<TrisolarisMasterChef, TrisolarisRewarder>) {
    return rewarderContract.tokenPerBlock();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TrisolarisMasterChef>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TrisolarisMasterChef>) {
    return contract.pendingTri(contractPosition.dataProps.poolIndex, address);
  }

  async getExtraRewardTokenBalances({
    address,
    rewarderContract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<TrisolarisMasterChef, TrisolarisRewarder>) {
    return rewarderContract
      .pendingTokens(contractPosition.dataProps.poolIndex, address, 0)
      .then(v => v.rewardAmounts[0]);
  }
}
