import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { JpegdViemContractFactory } from '../contracts';
import { JpegdLpFarmV2 } from '../contracts/viem';
import { JpegdLpFarmV2Contract } from '../contracts/viem/JpegdLpFarmV2';

@PositionTemplate()
export class EthereumJpegdChefV2ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<JpegdLpFarmV2> {
  groupLabel = 'Staking';
  chefAddress = '0xb271d2c9e693dde033d97f8a3c9911781329e4ca';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JpegdViemContractFactory) protected readonly contractFactory: JpegdViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.jpegdLpFarmV2({ address, network: this.network });
  }

  async getPoolLength(contract: JpegdLpFarmV2Contract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: JpegdLpFarmV2Contract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: JpegdLpFarmV2Contract): Promise<string> {
    return contract.read.jpeg();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<JpegdLpFarmV2>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<JpegdLpFarmV2>): Promise<BigNumberish> {
    return contract.read.epoch().then(v => v[2]);
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<JpegdLpFarmV2>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JpegdLpFarmV2>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JpegdLpFarmV2>): Promise<BigNumberish> {
    return contract.read.pendingReward([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
