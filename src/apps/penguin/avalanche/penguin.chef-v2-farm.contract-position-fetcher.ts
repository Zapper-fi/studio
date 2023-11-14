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

import { PenguinViemContractFactory } from '../contracts';
import { PenguinChefV2, PenguinExtraRewarder } from '../contracts/viem';
import { PenguinChefV2Contract } from '../contracts/viem/PenguinChefV2';
import { PenguinExtraRewarderContract } from '../contracts/viem/PenguinExtraRewarder';

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
    @Inject(PenguinViemContractFactory) protected readonly contractFactory: PenguinViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.penguinChefV2({ address, network: this.network });
  }

  getExtraRewarderContract(address: string) {
    return this.contractFactory.penguinExtraRewarder({ address, network: this.network });
  }

  async getPoolLength(contract: PenguinChefV2Contract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PenguinChefV2Contract, poolIndex: number) {
    return (await contract.read.poolInfo([BigInt(poolIndex)]))[0];
  }

  async getRewardTokenAddress(contract: PenguinChefV2Contract) {
    return contract.read.pefi();
  }

  async getExtraRewarder(contract: PenguinChefV2Contract, poolIndex: number) {
    return (await contract.read.poolInfo([BigInt(poolIndex)]))[1];
  }

  async getExtraRewardTokenAddresses(contract: PenguinExtraRewarderContract, poolIndex: number) {
    return contract.read.pendingTokens([BigInt(poolIndex), ZERO_ADDRESS, BigInt(0)]).then(v => [v[0][0]]);
  }
  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PenguinChefV2>) {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PenguinChefV2>) {
    return contract.read.pefiEmissionPerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PenguinChefV2>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[3]);
  }

  async getExtraRewardTokenRewardRates({
    contract,
    definition,
    multicall,
  }: GetMasterChefV2ExtraRewardTokenRewardRates<PenguinChefV2, PenguinExtraRewarder>) {
    const rewarderAddressRaw = await (await contract.read.poolInfo([BigInt(definition.poolIndex)]))[1];
    const rewarderRateContract = this.contractFactory.penguinRewarderRate({
      address: rewarderAddressRaw.toLowerCase(),
      network: this.network,
    });
    return multicall.wrap(rewarderRateContract).read.tokensPerSecond();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PenguinChefV2>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PenguinChefV2>) {
    return contract.read.pendingPEFI([BigInt(contractPosition.dataProps.poolIndex), address]);
  }

  async getExtraRewardTokenBalances({
    address,
    rewarderContract,
    contractPosition,
  }: GetMasterChefV2ExtraRewardTokenBalancesParams<PenguinChefV2, PenguinExtraRewarder>): Promise<
    BigNumberish | BigNumberish[]
  > {
    return rewarderContract.read
      .pendingTokens([BigInt(contractPosition.dataProps.poolIndex), address, BigInt(0)])
      .then(v => v[1][0]);
  }
}
