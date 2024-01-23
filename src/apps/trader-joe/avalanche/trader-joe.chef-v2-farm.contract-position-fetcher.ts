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
import { TraderJoeChefV2Contract } from '../contracts/viem/TraderJoeChefV2';
import { TraderJoeChefV2RewarderContract } from '../contracts/viem/TraderJoeChefV2Rewarder';

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

  getExtraRewarderContract(address: string): TraderJoeChefV2RewarderContract {
    return this.traderJoeContractFactory.traderJoeChefV2Rewarder({ address, network: this.network });
  }

  async getPoolLength(contract: TraderJoeChefV2Contract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: TraderJoeChefV2Contract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: TraderJoeChefV2Contract) {
    return contract.read.joe();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.read.joePerSec();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<TraderJoeChefV2>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getExtraRewarder(contract: TraderJoeChefV2Contract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[4]);
  }

  async getExtraRewardTokenAddresses(contract: TraderJoeChefV2RewarderContract): Promise<string[]> {
    return [await contract.read.rewardToken()];
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<TraderJoeChefV2, TraderJoeChefV2Rewarder>) {
    return [
      await rewarderContract.read.rewardPerSecond().catch(err => {
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
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV2>) {
    return contract.read
      .pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address])
      .then(v => v[0])
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
    return contract.read
      .pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address])
      .then(v => v[3])
      .catch(e => {
        if (isViemMulticallUnderlyingError(e)) return 0;
        throw e;
      });
  }
}
