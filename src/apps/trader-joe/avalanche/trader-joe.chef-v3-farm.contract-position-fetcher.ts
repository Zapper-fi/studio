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
import { TraderJoeChefV2Rewarder, TraderJoeChefV3 } from '../contracts/viem';
import { TraderJoeChefV2RewarderContract } from '../contracts/viem/TraderJoeChefV2Rewarder';
import { TraderJoeChefV3Contract } from '../contracts/viem/TraderJoeChefV3';

@PositionTemplate()
export class AvalancheTraderJoeChefV3FarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  TraderJoeChefV3,
  TraderJoeChefV2Rewarder
> {
  groupLabel = 'Farms';
  chefAddress = '0x188bed1968b795d5c9022f6a0bb5931ac4c18f00';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(TraderJoeViemContractFactory) protected readonly traderJoeContractFactory: TraderJoeViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.traderJoeContractFactory.traderJoeChefV3({ address, network: this.network });
  }

  getExtraRewarderContract(address: string): TraderJoeChefV2RewarderContract {
    return this.traderJoeContractFactory.traderJoeChefV2Rewarder({ address, network: this.network });
  }

  async getPoolLength(contract: TraderJoeChefV3Contract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: TraderJoeChefV3Contract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: TraderJoeChefV3Contract) {
    return contract.read.JOE();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV3>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<TraderJoeChefV3>) {
    return await contract.read.joePerSec().catch(err => {
      if (isViemMulticallUnderlyingError(err)) return 0;
      throw err;
    });
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<TraderJoeChefV3>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[3]);
  }

  async getExtraRewarder(contract: TraderJoeChefV3Contract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[4]);
  }

  async getExtraRewardTokenAddresses(contract: TraderJoeChefV2RewarderContract): Promise<string[]> {
    return [await contract.read.rewardToken()];
  }

  async getExtraRewardTokenRewardRates({
    rewarderContract,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<TraderJoeChefV3, TraderJoeChefV2Rewarder>) {
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
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV3>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<TraderJoeChefV3>) {
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
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<TraderJoeChefV3, TraderJoeChefV2Rewarder>) {
    return contract.read
      .pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address])
      .then(v => v[3])
      .catch(e => {
        if (isViemMulticallUnderlyingError(e)) return 0;
        throw e;
      });
  }
}
