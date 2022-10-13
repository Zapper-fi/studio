import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { PancakeswapCakeChef, PancakeswapContractFactory } from '../contracts';
import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

@PositionTemplate()
export class BinanceSmartChainPancakeswapAutoCakeContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapCakeChef> {
  appId = PANCAKESWAP_DEFINITION.id;
  groupId = PANCAKESWAP_DEFINITION.groups.autoCake.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Auto CAKE';
  isExcludedFromTvl = true;

  chefAddress = '0xa80240eb5d7e05d3f250cf000eec0891d00b51cc';
  mainChefAddress = '0x73feaa1ee314f8c655e354234017be2193c9e24e';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) protected readonly contractFactory: PancakeswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapCakeChef({ address, network: this.network });
  }

  async getPoolLength() {
    return 1;
  }

  async getStakedTokenAddress(contract: PancakeswapCakeChef) {
    return contract.token();
  }

  async getRewardTokenAddress(contract: PancakeswapCakeChef) {
    return contract.token();
  }

  async getTotalAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapCakeChef>): Promise<BigNumberish> {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    return multicall.wrap(mainChef).totalAllocPoint();
  }

  async getPoolAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapCakeChef>) {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    const poolInfo = await multicall.wrap(mainChef).poolInfo(0);
    return poolInfo.allocPoint;
  }

  async getTotalRewardRate({ multicall }: GetMasterChefDataPropsParams<PancakeswapCakeChef>): Promise<BigNumberish> {
    const mainChef = this.contractFactory.pancakeswapChef({ address: this.mainChefAddress, network: this.network });
    return multicall.wrap(mainChef).cakePerBlock();
  }

  async getStakedTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<PancakeswapCakeChef>) {
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
