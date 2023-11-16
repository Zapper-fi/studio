import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

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

import { PickleViemContractFactory } from '../contracts';
import { PickleMiniChefV2, PickleRewarder } from '../contracts/viem';
import { PickleMiniChefV2Contract } from '../contracts/viem/PickleMiniChefV2';
import { PickleRewarderContract } from '../contracts/viem/PickleRewarder';

@PositionTemplate()
export class PolygonPickleFarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  PickleMiniChefV2,
  PickleRewarder
> {
  groupLabel = 'Farms';
  chefAddress = '0x20b2a3fc7b13ca0ccf7af81a68a14cb3116e8749';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleViemContractFactory) protected readonly contractFactory: PickleViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pickleMiniChefV2({ address, network: this.network });
  }

  getExtraRewarderContract(address: string) {
    return this.contractFactory.pickleRewarder({ address, network: this.network });
  }

  async getPoolLength(contract: PickleMiniChefV2Contract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PickleMiniChefV2Contract, poolIndex: number) {
    return contract.read.lpToken([BigInt(poolIndex)]);
  }

  async getRewardTokenAddress(contract: PickleMiniChefV2Contract) {
    return contract.read.PICKLE();
  }

  async getExtraRewarder(contract: PickleMiniChefV2Contract, poolIndex: number) {
    return contract.read.rewarder([BigInt(poolIndex)]);
  }

  async getExtraRewardTokenAddresses(contract: PickleRewarderContract, poolIndex: number) {
    return contract.read.pendingTokens([BigInt(poolIndex), ZERO_ADDRESS, BigInt(0)]).then(v => [v[0][0]]);
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PickleMiniChefV2>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PickleMiniChefV2>) {
    return contract.read.picklePerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PickleMiniChefV2>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[2]);
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<PickleMiniChefV2, PickleRewarder>) {
    return rewarderContract.read.rewardPerSecond();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PickleMiniChefV2>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PickleMiniChefV2>) {
    return contract.read.pendingPickle([BigInt(contractPosition.dataProps.poolIndex), address]);
  }

  async getExtraRewardTokenBalances({
    address,
    rewarderContract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<PickleMiniChefV2, PickleRewarder>): Promise<
    BigNumberish | BigNumberish[]
  > {
    return rewarderContract.read
      .pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address, BigInt(0)])
      .then(v => v[1][0]);
  }
}
