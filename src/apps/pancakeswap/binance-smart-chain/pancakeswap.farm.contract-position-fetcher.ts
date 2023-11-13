import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PancakeswapViemContractFactory } from '../contracts';
import { PancakeswapChef } from '../contracts/viem';
import { PancakeswapChefContract } from '../contracts/viem/PancakeswapChef';

@PositionTemplate()
export class BinanceSmartChainPancakeswapFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapChef> {
  isExcludedFromTvl = true;
  groupLabel = 'Farms';

  chefAddress = '0x73feaa1ee314f8c655e354234017be2193c9e24e';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapViemContractFactory) protected readonly contractFactory: PancakeswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapChef({ address, network: this.network });
  }

  async getPoolLength(contract: PancakeswapChefContract) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PancakeswapChefContract, poolIndex: number) {
    return contract.read.poolInfo([BigInt(poolIndex)]).then(v => v[0]);
  }

  async getRewardTokenAddress(contract: PancakeswapChefContract) {
    return contract.read.cake();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PancakeswapChef>) {
    return contract.read.totalAllocPoint();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PancakeswapChef>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(v => v[1]);
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PancakeswapChef>) {
    return contract.read.cakePerBlock();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PancakeswapChef>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v[0]);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PancakeswapChef>) {
    return contract.read.pendingCake([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
