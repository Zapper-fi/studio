import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BananoViemContractFactory } from '../contracts';
import { Benis } from '../contracts/viem';
import { BenisContract } from '../contracts/viem/Benis';

export abstract class BananoFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<Benis> {
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BananoViemContractFactory) protected readonly contractFactory: BananoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.benis({ address, network: this.network });
  }

  async getPoolLength(contract: BenisContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: BenisContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: BenisContract): Promise<string> {
    return contract.read.wban();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<Benis>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<Benis>): Promise<BigNumberish> {
    const now = Date.now();
    const endTime = (await contract.read.endTime()) * 1_000;
    return endTime < now ? 0 : contract.read.wbanPerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<Benis>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[4]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<Benis>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<Benis>): Promise<BigNumberish> {
    return contract.read.pendingWBAN([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
