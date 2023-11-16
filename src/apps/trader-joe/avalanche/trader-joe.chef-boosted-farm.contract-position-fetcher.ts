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

import { TraderJoeViemContractFactory } from '../contracts';
import { TraderJoeChefBoosted } from '../contracts/viem';
import { TraderJoeChefBoostedContract } from '../contracts/viem/TraderJoeChefBoosted';
import {
  TraderJoeChefBoostedRewarder,
  TraderJoeChefBoostedRewarderContract,
} from '../contracts/viem/TraderJoeChefBoostedRewarder';

@PositionTemplate()
export class AvalancheTraderJoeChefBoostedFarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  TraderJoeChefBoosted,
  TraderJoeChefBoostedRewarder
> {
  groupLabel = 'Boost';
  chefAddress = '0x4483f0b6e2f5486d06958c20f8c39a7abe87bf8f';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeViemContractFactory) protected readonly traderJoeContractFactory: TraderJoeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.traderJoeContractFactory.traderJoeChefBoosted({ address, network: this.network });
  }

  getExtraRewarderContract(address: string): TraderJoeChefBoostedRewarderContract {
    return this.traderJoeContractFactory.traderJoeChefBoostedRewarder({ address, network: this.network });
  }

  async getPoolLength(contract: TraderJoeChefBoostedContract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: TraderJoeChefBoostedContract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: TraderJoeChefBoostedContract) {
    return contract.read.JOE();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<TraderJoeChefBoosted>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeChefBoosted>) {
    return contract.read.joePerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<TraderJoeChefBoosted>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getExtraRewarder(contract: TraderJoeChefBoostedContract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[5]);
  }

  async getExtraRewardTokenAddresses(contract: TraderJoeChefBoostedRewarderContract): Promise<string[]> {
    return [await contract.read.rewardToken()];
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<TraderJoeChefBoosted, TraderJoeChefBoostedRewarder>) {
    return [await rewarderContract.read.tokenPerSec()];
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefBoosted>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefBoosted>) {
    return contract.read.pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getExtraRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<TraderJoeChefBoosted, TraderJoeChefBoostedRewarder>) {
    return contract.read.pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[3]);
  }
}
