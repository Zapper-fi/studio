import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isSupplied } from '~position/position.utils';
import { GetDataPropsParams } from '~position/template/contract-position.template.types';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';

import { PancakeswapViemContractFactory } from '../contracts';
import { PancakeswapCakeChef } from '../contracts/viem';
import { PancakeswapCakeChefContract } from '../contracts/viem/PancakeswapCakeChef';

@PositionTemplate()
export class BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapCakeChef> {
  groupLabel = 'Auto CAKE';
  isExcludedFromTvl = true;

  chefAddress = '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc';
  mainChefAddress = '0x73feaa1ee314f8c655e354234017be2193c9e24e';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapViemContractFactory) protected readonly contractFactory: PancakeswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapCakeChef({ address, network: this.network });
  }

  async getPoolLength() {
    return 1;
  }

  async getStakedTokenAddress(contract: PancakeswapCakeChefContract) {
    return contract.read.token();
  }

  async getRewardTokenAddress(contract: PancakeswapCakeChefContract) {
    return contract.read.token();
  }

  async getReserve({ contractPosition, multicall }: GetDataPropsParams<PancakeswapCakeChef>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    const userInfo = await multicall.wrap(mainChef).read.userInfo([BigInt(0), contractPosition.address]);
    const reserve = Number(userInfo[0]) / 10 ** stakedToken.decimals;
    return reserve;
  }

  async getTotalAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapCakeChef>): Promise<BigNumberish> {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    return multicall.wrap(mainChef).read.totalAllocPoint();
  }

  async getPoolAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapCakeChef>) {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    const poolInfo = await multicall.wrap(mainChef).read.poolInfo([BigInt(0)]);
    return poolInfo[1];
  }

  async getTotalRewardRate({ multicall }: GetMasterChefDataPropsParams<PancakeswapCakeChef>): Promise<BigNumberish> {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    return multicall.wrap(mainChef).read.cakePerBlock();
  }

  async getStakedTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<PancakeswapCakeChef>) {
    const [userInfo, pricePerShareRaw] = await Promise.all([
      contract.read.userInfo([address]),
      contract.read.getPricePerFullShare(),
    ]);

    const shares = userInfo[0].toString();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return new BigNumber(shares).times(pricePerShare).toFixed(0);
  }

  async getRewardTokenBalance() {
    return 0;
  }
}
