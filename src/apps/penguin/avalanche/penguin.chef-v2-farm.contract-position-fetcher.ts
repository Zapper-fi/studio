import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefV2ExtraRewardTokenBalancesParams,
  GetMasterChefV2ExtraRewardTokenRewardRates,
  MasterChefV2TemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef-v2.template.contract-position-fetcher';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PenguinChefV2, PenguinContractFactory, PenguinExtraRewarder } from '../contracts';

@PositionTemplate()
export class AvalanchePenguinChefV2FarmContractPositionFetcher extends MasterChefV2TemplateContractPositionFetcher<
  PenguinChefV2,
  PenguinExtraRewarder
> {
  groupLabel = 'Farms';
  chefAddress = '0x256040dc7b3cecf73a759634fc68aa60ea0d68cb';
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PenguinContractFactory) protected readonly contractFactory: PenguinContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PenguinChefV2 {
    return this.contractFactory.penguinChefV2({ address, network: this.network });
  }

  getExtraRewarderContract(address: string) {
    return this.contractFactory.penguinExtraRewarder({ address, network: this.network });
  }

  async getPoolLength(contract: PenguinChefV2) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: PenguinChefV2, poolIndex: number) {
    return (await contract.poolInfo(poolIndex)).poolToken;
  }

  async getRewardTokenAddress(contract: PenguinChefV2) {
    return contract.pefi();
  }

  async getExtraRewarder(contract: PenguinChefV2, poolIndex: number) {
    return (await contract.poolInfo(poolIndex)).rewarder;
  }

  async getExtraRewardTokenAddresses(contract: PenguinExtraRewarder, poolIndex: number) {
    return contract.pendingTokens(poolIndex, ZERO_ADDRESS, 0).then(v => [v[0][0]]);
  }
  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PenguinChefV2>) {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PenguinChefV2>) {
    return contract.pefiEmissionPerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PenguinChefV2>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getExtraRewardTokenRewardRates({
    contract,
    definition,
    multicall,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<PenguinChefV2, PenguinExtraRewarder>) {
    const rewarderAddressRaw = await (await contract.poolInfo(definition.poolIndex)).rewarder;
    const rewarderRateContract = this.contractFactory.penguinRewarderRate({
      address: rewarderAddressRaw.toLowerCase(),
      network: this.network,
    });
    return multicall.wrap(rewarderRateContract).tokensPerSecond();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PenguinChefV2>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PenguinChefV2>) {
    return contract.pendingPEFI(contractPosition.dataProps.poolIndex, address);
  }

  async getExtraRewardTokenBalances({
    address,
    rewarderContract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<PenguinChefV2, PenguinExtraRewarder>): Promise<
    BigNumberish | BigNumberish[]
  > {
    return rewarderContract.pendingTokens(contractPosition.dataProps.poolIndex, address, 0).then(v => v[1][0]);
  }
}
