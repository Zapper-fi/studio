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

import { TraderJoeChefV2Rewarder, TraderJoeChefV3, TraderJoeContractFactory } from '../contracts';

@PositionTemplate()
export class AvalancheTraderJoeChefV3FarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  TraderJoeChefV3,
  TraderJoeChefV2Rewarder
> {
  groupLabel = 'Farms';
  chefAddress = '0x188bed1968b795d5c9022f6a0bb5931ac4c18f00';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeContractFactory) protected readonly traderJoeContractFactory: TraderJoeContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): TraderJoeChefV3 {
    return this.traderJoeContractFactory.traderJoeChefV3({ address, network: this.network });
  }

  getExtraRewarderContract(address: string): TraderJoeChefV2Rewarder {
    return this.traderJoeContractFactory.traderJoeChefV2Rewarder({ address, network: this.network });
  }

  async getPoolLength(contract: TraderJoeChefV3) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: TraderJoeChefV3, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: TraderJoeChefV3) {
    return contract.JOE();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV3>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV3>) {
    return contract.joePerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<TraderJoeChefV3>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getExtraRewarder(contract: TraderJoeChefV3, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.rewarder);
  }

  async getExtraRewardTokenAddresses(contract: TraderJoeChefV2Rewarder): Promise<string[]> {
    return [await contract.rewardToken()];
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<TraderJoeChefV3, TraderJoeChefV2Rewarder>) {
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
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV3>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV3>) {
    return contract.pendingTokens(contractPosition.dataProps.poolIndex, address).then(v => v.pendingJoe);
  }

  async getExtraRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<TraderJoeChefV3, TraderJoeChefV2Rewarder>) {
    return contract.pendingTokens(contractPosition.dataProps.poolIndex, address).then(v => v.pendingBonusToken);
  }
}
