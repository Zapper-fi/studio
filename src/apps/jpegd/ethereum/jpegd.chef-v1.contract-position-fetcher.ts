import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { JpegdContractFactory, JpegdLpFarm } from '../contracts';

@PositionTemplate()
export class EthereumJpegdChefV1ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<JpegdLpFarm> {
  groupLabel = 'Staking';
  chefAddress = '0x3eed641562ac83526d7941e4326559e7b607556b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(JpegdContractFactory) protected readonly contractFactory: JpegdContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): JpegdLpFarm {
    return this.contractFactory.jpegdLpFarm({ address, network: this.network });
  }

  async getPoolLength(contract: JpegdLpFarm): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: JpegdLpFarm, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: JpegdLpFarm): Promise<string> {
    return contract.jpeg();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.epoch().then(v => v.rewardPerBlock);
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<JpegdLpFarm>): Promise<BigNumberish> {
    return contract.pendingReward(contractPosition.dataProps.poolIndex, address);
  }
}
