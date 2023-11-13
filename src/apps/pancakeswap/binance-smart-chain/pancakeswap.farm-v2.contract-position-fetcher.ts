import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PancakeswapViemContractFactory } from '../contracts';
import { PancakeswapChefV2 } from '../contracts/viem';

@PositionTemplate()
export class BinanceSmartChainPancakeswapFarmV2ContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapChefV2> {
  isExcludedFromTvl = true;
  groupLabel = 'Farms';

  chefAddress = '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapViemContractFactory) protected readonly contractFactory: PancakeswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapChefV2({ address, network: this.network });
  }

  async getPoolLength(contract: PancakeswapChefV2) {
    return contract.read.poolLength();
  }

  async getStakedTokenAddress(contract: PancakeswapChefV2, poolIndex: number) {
    return contract.read.lpToken([BigInt(poolIndex)]);
  }

  async getRewardTokenAddress(contract: PancakeswapChefV2) {
    return contract.read.CAKE();
  }

  async getTotalAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PancakeswapChefV2>) {
    const poolInfo = await contract.read.poolInfo([BigInt(definition.poolIndex)]);
    return poolInfo.isRegular ? contract.read.totalRegularAllocPoint() : contract.read.totalSpecialAllocPoint();
  }

  async getPoolAllocPoints({ contract, definition }: GetMasterChefDataPropsParams<PancakeswapChefV2>) {
    return contract.read.poolInfo([BigInt(definition.poolIndex)]).then(i => i.allocPoint);
  }

  async getTotalRewardRate({ contract, definition }: GetMasterChefDataPropsParams<PancakeswapChefV2>) {
    const poolInfo = await contract.read.poolInfo([BigInt(definition.poolIndex)]);
    return contract.read.cakePerBlock([poolInfo.isRegular]);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PancakeswapChefV2>) {
    return contract.read.userInfo([BigInt(contractPosition.dataProps.poolIndex), address]).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<PancakeswapChefV2>) {
    return contract.read.pendingCake([BigInt(contractPosition.dataProps.poolIndex), address]);
  }
}
