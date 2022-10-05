import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { BiswapContractFactory, BiswapMasterchef } from '../contracts';

@PositionTemplate()
export class BinanceSmartChainBiswapContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<BiswapMasterchef> {
  groupLabel = 'Farms';
  chefAddresses = ['0xdbc1a13490deef9c3c12b44fe77b503c1b061739'];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(BiswapContractFactory) protected readonly contractFactory: BiswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): BiswapMasterchef {
    return this.contractFactory.biswapMasterchef({ address, network: this.network });
  }

  async getPoolLength(contract: BiswapMasterchef): Promise<BigNumberish> {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: BiswapMasterchef, poolIndex: number): Promise<string> {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: BiswapMasterchef): Promise<string> {
    return contract.BSW();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.BSWPerBlock();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<BiswapMasterchef>): Promise<BigNumberish> {
    return contract.pendingBSW(contractPosition.dataProps.poolIndex, address);
  }
}
