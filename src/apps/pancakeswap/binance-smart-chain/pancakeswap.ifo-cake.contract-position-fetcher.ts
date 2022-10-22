import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isSupplied } from '~position/position.utils';
import { GetDataPropsParams } from '~position/template/contract-position.template.types';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PancakeswapContractFactory, PancakeswapIfoChef } from '../contracts';

@PositionTemplate()
export class BinanceSmartChainPancakeswapIfoCakeContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapIfoChef> {
  isExcludedFromTvl = true;
  groupLabel = 'Farms';

  chefAddress = '0x1b2a2f6ed4a1401e8c73b4c2b6172455ce2f78e8';
  cakeChefAddress = '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc';
  mainChefAddress = '0x73feaa1ee314f8c655e354234017be2193c9e24e';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) protected readonly contractFactory: PancakeswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapIfoChef({ address, network: this.network });
  }

  async getPoolLength() {
    return 1;
  }

  async getStakedTokenAddress(contract: PancakeswapIfoChef) {
    return contract.token();
  }

  async getRewardTokenAddress(contract: PancakeswapIfoChef) {
    return contract.token();
  }

  async getReserve({ contractPosition, multicall }: GetDataPropsParams<PancakeswapIfoChef>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const cakeChefContract = this.contractFactory.pancakeswapCakeChef({
      address: this.cakeChefAddress,
      network: this.network,
    });

    const reserveRaw = await multicall.wrap(cakeChefContract).balanceOf();
    const reserve = Number(reserveRaw) / 10 ** stakedToken.decimals;
    return reserve;
  }

  async getTotalAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapIfoChef>) {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    return multicall.wrap(mainChef).totalAllocPoint();
  }

  async getPoolAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapIfoChef>) {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    const poolInfo = await multicall.wrap(mainChef).poolInfo(0);
    return poolInfo.allocPoint;
  }

  async getTotalRewardRate({ multicall }: GetMasterChefDataPropsParams<PancakeswapIfoChef>) {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    return multicall.wrap(mainChef).cakePerBlock();
  }

  async getStakedTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<PancakeswapIfoChef>) {
    const [userInfo, pricePerShareRaw] = await Promise.all([
      contract.userInfo(address),
      contract.getPricePerFullShare(),
    ]);

    const shares = userInfo.shares.toString();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return new BigNumber(shares).times(pricePerShare).toFixed(0);
  }

  async getRewardTokenBalance() {
    return 0;
  }
}
