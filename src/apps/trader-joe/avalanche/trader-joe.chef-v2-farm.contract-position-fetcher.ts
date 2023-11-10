import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
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
import { TraderJoeChefV2, TraderJoeChefV2Rewarder } from '../contracts/viem';

@PositionTemplate()
export class AvalancheTraderJoeChefV2FarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  TraderJoeChefV2,
  TraderJoeChefV2Rewarder
> {
  groupLabel = 'Farms';
  chefAddress = '0xd6a4f121ca35509af06a0be99093d08462f53052';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeViemContractFactory) protected readonly traderJoeContractFactory: TraderJoeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.traderJoeContractFactory.traderJoeChefV2({ address, network: this.network });
  }

  getExtraRewarderContract(address: string): TraderJoeChefV2Rewarder {
    return this.traderJoeContractFactory.traderJoeChefV2Rewarder({ address, network: this.network });
  }

  async getPoolLength(contract: TraderJoeChefV2) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: TraderJoeChefV2, poolIndex: number) {
    return contract.read.poolInfo([poolIndex]).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: TraderJoeChefV2) {
    return contract.read.joe();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.read.joePerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v.allocPoint);
  }

  async getExtraRewarder(contract: TraderJoeChefV2, poolIndex: number) {
    return contract.read.poolInfo([poolIndex]).then(v => v.rewarder);
  }

  async getExtraRewardTokenAddresses(contract: TraderJoeChefV2Rewarder): Promise<string[]> {
    return [await contract.read.rewardToken()];
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<TraderJoeChefV2, TraderJoeChefV2Rewarder>) {
    return [
      await rewardercontract.read.rewardPerSecond().catch(err => {
        if (isViemMulticallUnderlyingError(err)) return 0;
        throw err;
      }),
    ];
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV2>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV2>) {
    return contract
      .pendingTokens(contractPosition.dataProps.poolIndex, address)
      .then(v => v.pendingJoe)
      .catch(e => {
        if (isViemMulticallUnderlyingError(e)) return 0;
        throw e;
      });
  }

  async getExtraRewardTokenBalances({
    address,
    contract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<TraderJoeChefV2, TraderJoeChefV2Rewarder>) {
    return contract
      .pendingTokens(contractPosition.dataProps.poolIndex, address)
      .then(v => v.pendingBonusToken)
      .catch(e => {
        if (isViemMulticallUnderlyingError(e)) return 0;
        throw e;
      });
  }
}
