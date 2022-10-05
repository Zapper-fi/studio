import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import {
  GetMasterChefV2ExtraRewardTokenBalancesParams,
  GetMasterChefV2ExtraRewardTokenRewardRates,
  MasterChefV2TemplateContractPositionFetcher,
} from '~position/template/master-chef-v2.template.contract-position-fetcher';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { TraderJoeChefV2, TraderJoeChefV2Rewarder, TraderJoeContractFactory } from '../contracts';

@PositionTemplate()
export class AvalancheTraderJoeChefV2FarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  TraderJoeChefV2,
  TraderJoeChefV2Rewarder
> {
  groupLabel = 'Farms';
  chefAddresses = ['0xd6a4f121ca35509af06a0be99093d08462f53052'];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory) protected readonly traderJoeContractFactory: TraderJoeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TraderJoeChefV2 {
    return this.traderJoeContractFactory.traderJoeChefV2({ address, network: this.network });
  }

  getExtraRewarderContract(address: string): TraderJoeChefV2Rewarder {
    return this.traderJoeContractFactory.traderJoeChefV2Rewarder({ address, network: this.network });
  }

  async getPoolLength(contract: TraderJoeChefV2) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: TraderJoeChefV2, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: TraderJoeChefV2) {
    return contract.joe();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.joePerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getExtraRewarder(contract: TraderJoeChefV2, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.rewarder);
  }

  async getExtraRewardTokenAddresses(contract: TraderJoeChefV2Rewarder): Promise<string[]> {
    return [await contract.rewardToken()];
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<TraderJoeChefV2, TraderJoeChefV2Rewarder>) {
    return [
      await rewarderContract.rewardPerSecond().catch(err => {
        if (isMulticallUnderlyingError(err)) return 0;
        throw err;
      }),
    ];
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV2>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV2>) {
    return contract.pendingTokens(contractPosition.dataProps.poolIndex, address).then(v => v.pendingJoe);
  }

  async getExtraRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<TraderJoeChefV2, TraderJoeChefV2Rewarder>) {
    return contract.pendingTokens(contractPosition.dataProps.poolIndex, address).then(v => v.pendingBonusToken);
  }
}
