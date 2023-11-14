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
import { JpegdLpFarm } from '../contracts/viem';
import { JpegdLpFarmContract } from '../contracts/viem/JpegdLpFarm';

@PositionTemplate()
export class EthereumJpegdChefV1ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<JpegdLpFarm> {
  groupLabel = 'Staking';
  chefAddress = '0x3eed641562ac83526d7941e4326559e7b607556b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JpegdViemContractFactory) protected readonly contractFactory: JpegdViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.jpegdLpFarm({ address, network: this.network });
  }

  async getPoolLength(contract: JpegdLpFarmContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: JpegdLpFarmContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: JpegdLpFarmContract): Promise<string> {
    return contract.read.jpeg();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.read.epoch().then(v => v[2]);
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.read.pendingReward([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
