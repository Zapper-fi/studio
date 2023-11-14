import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { SteakHutViemContractFactory } from '../contracts';
import { SteakHutPool } from '../contracts/viem';
import { SteakHutPoolContract } from '../contracts/viem/SteakHutPool';

@PositionTemplate()
export class AvalancheSteakHutPoolContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<SteakHutPool> {
  groupLabel = 'Pools';
  chefAddress = '0xddbfbd5dc3ba0feb96cb513b689966b2176d4c09';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SteakHutViemContractFactory) protected readonly contractFactory: SteakHutViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.steakHutPool({ address, network: this.network });
  }

  async getPoolLength(contract: SteakHutPoolContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: SteakHutPoolContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: SteakHutPoolContract): Promise<string> {
    return contract.read.JOE();
  }

  async getTotalAllocPoints(): Promise<BigNumberish> {
    return 1;
  }

  async getTotalRewardRate(): Promise<BigNumberish> {
    return 0;
  }

  async getPoolAllocPoints(): Promise<BigNumberish> {
    return 0;
  }

  getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<SteakHutPool>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<SteakHutPool>): Promise<BigNumberish> {
    return contract.read.pendingJoe([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
