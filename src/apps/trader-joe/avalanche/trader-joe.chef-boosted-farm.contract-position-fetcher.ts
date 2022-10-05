import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
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

import { TraderJoeChefBoosted, TraderJoeContractFactory } from '../contracts';
import { TraderJoeChefBoostedRewarder } from '../contracts/ethers/TraderJoeChefBoostedRewarder';

@PositionTemplate()
export class AvalancheTraderJoeChefBoostedFarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  TraderJoeChefBoosted,
  TraderJoeChefBoostedRewarder
> {
  groupLabel = 'Boost';
  chefAddresses = ['0x4483f0b6e2f5486d06958c20f8c39a7abe87bf8f'];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory) protected readonly traderJoeContractFactory: TraderJoeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TraderJoeChefBoosted {
    return this.traderJoeContractFactory.traderJoeChefBoosted({ address, network: this.network });
  }

  getExtraRewarderContract(address: string): TraderJoeChefBoostedRewarder {
    return this.traderJoeContractFactory.traderJoeChefBoostedRewarder({ address, network: this.network });
  }

  async getPoolLength(contract: TraderJoeChefBoosted) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: TraderJoeChefBoosted, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: TraderJoeChefBoosted) {
    return contract.JOE();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<TraderJoeChefBoosted>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeChefBoosted>) {
    return contract.joePerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<TraderJoeChefBoosted>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getExtraRewarder(contract: TraderJoeChefBoosted, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.rewarder);
  }

  async getExtraRewardTokenAddresses(contract: TraderJoeChefBoostedRewarder): Promise<string[]> {
    return [await contract.rewardToken()];
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<TraderJoeChefBoosted, TraderJoeChefBoostedRewarder>) {
    return [await rewarderContract.tokenPerSec()];
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefBoosted>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefBoosted>) {
    return contract.pendingTokens(contractPosition.dataProps.poolIndex, address).then(v => v.pendingJoe);
  }

  async getExtraRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<TraderJoeChefBoosted, TraderJoeChefBoostedRewarder>) {
    return contract.pendingTokens(contractPosition.dataProps.poolIndex, address).then(v => v.pendingBonusToken);
  }
}
