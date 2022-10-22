import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PancakeswapChef, PancakeswapContractFactory } from '../contracts';

@PositionTemplate()
export class BinanceSmartChainPancakeswapFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapChef> {
  isExcludedFromTvl = true;
  groupLabel = 'Farms';

  chefAddress = '0x73feaa1ee314f8c655e354234017be2193c9e24e';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) protected readonly contractFactory: PancakeswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapChef({ address, network: this.network });
  }

  async getPoolLength(contract: PancakeswapChef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: PancakeswapChef, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.lpToken);
  }

  async getRewardTokenAddress(contract: PancakeswapChef) {
    return contract.cake();
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<PancakeswapChef>) {
    return contract.totalAllocPoint();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PancakeswapChef>) {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<PancakeswapChef>) {
    return contract.cakePerBlock();
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PancakeswapChef>) {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PancakeswapChef>) {
    return contract.pendingCake(contractPosition.dataProps.poolIndex, address);
  }
}
