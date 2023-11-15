import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BiswapViemContractFactory } from '../contracts';
import { BiswapMasterchef } from '../contracts/viem';
import { BiswapMasterchefContract } from '../contracts/viem/BiswapMasterchef';

@PositionTemplate()
export class BinanceSmartChainBiswapContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<BiswapMasterchef> {
  groupLabel = 'Farms';
  chefAddress = '0xdbc1a13490deef9c3c12b44fe77b503c1b061739';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BiswapViemContractFactory) protected readonly contractFactory: BiswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.biswapMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: BiswapMasterchefContract): Promise<BigNumberish> {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: BiswapMasterchefContract, poolIndex: number): Promise<string> {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: BiswapMasterchefContract): Promise<string> {
    return contract.read.BSW();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.read.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.read.BSWPerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.read.pendingBSW([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
