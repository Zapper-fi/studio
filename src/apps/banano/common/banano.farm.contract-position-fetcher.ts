import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
  RewardRateUnit,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BananoContractFactory, Benis } from '../contracts';

export abstract class BananoFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<Benis> {
  rewardRateUnit = RewardRateUnit.SECOND;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BananoViemContractFactory) protected readonly contractFactory: BananoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Benis {
    return this.contractFactory.benis({ address, network: this.network });
  }

  async getPoolLength(contract: Benis): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: Benis, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.stakingToken);
  }

  async getRewardTokenAddress(contract: Benis): Promise<string> {
    return contract.wban();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<Benis>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<Benis>): Promise<BigNumberish> {
    return contract.wbanPerSecond();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<Benis>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<Benis>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<Benis>): Promise<BigNumberish> {
    return contract.pendingWBAN(contractPosition.dataProps.poolIndex, address);
  }
}
