// 0xa5f8c5dbd5f286960b9d90548680ae5ebff07652 => LP Staking

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

import { PancakeswapContractFactory, PancakeswapSyrupCake } from '../contracts';
import { PANCAKESWAP_DEFINITION } from '../pancakeswap.definition';

@PositionTemplate()
export class BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapSyrupCake> {
  appId = PANCAKESWAP_DEFINITION.id;
  groupId = PANCAKESWAP_DEFINITION.groups.syrupCake.id;
  network = Network.BINANCE_SMART_CHAIN_MAINNET;
  groupLabel = 'Syrup Pools';

  chefAddress = '0x45c54210128a065de780c4b0df3d16664f7f859e';
  chefV2Address = '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) protected readonly contractFactory: PancakeswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapSyrupCake({ address, network: this.network });
  }

  async getPoolLength() {
    return 1;
  }

  async getStakedTokenAddress(contract: PancakeswapSyrupCake) {
    return contract.token();
  }

  async getRewardTokenAddress(contract: PancakeswapSyrupCake) {
    return contract.token();
  }

  async getTotalAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapSyrupCake>): Promise<BigNumberish> {
    const chefV2 = this.contractFactory.pancakeswapChefV2({ address: this.chefV2Address, network: this.network });
    const poolInfo = await multicall.wrap(chefV2).poolInfo(0);
    const totalAllocPoints = await (poolInfo.isRegular
      ? chefV2.totalRegularAllocPoint()
      : chefV2.totalSpecialAllocPoint());
    return totalAllocPoints;
  }

  async getPoolAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapSyrupCake>) {
    const chefV2 = this.contractFactory.pancakeswapChefV2({ address: this.chefV2Address, network: this.network });
    const poolInfo = await multicall.wrap(chefV2).poolInfo(0);
    const poolAllocPoints = poolInfo.allocPoint;
    return poolAllocPoints;
  }

  async getTotalRewardRate({ multicall }: GetMasterChefDataPropsParams<PancakeswapSyrupCake>): Promise<BigNumberish> {
    const chefV2 = this.contractFactory.pancakeswapChefV2({ address: this.chefV2Address, network: this.network });
    const poolInfo = await multicall.wrap(chefV2).poolInfo(0);
    const cakePerBlock = await multicall.wrap(chefV2).cakePerBlock(poolInfo.isRegular);
    return cakePerBlock;
  }

  async getStakedTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<PancakeswapSyrupCake>) {
    const [userInfo, pricePerShareRaw] = await Promise.all([
      contract.userInfo(address),
      contract.getPricePerFullShare(),
    ]);

    const shares = userInfo.shares.toString();
    const userBoostedShare = userInfo.userBoostedShare.toString();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return new BigNumber(shares).times(pricePerShare).minus(userBoostedShare).toFixed(0);
  }

  async getRewardTokenBalance() {
    return 0;
  }
}
