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

import { PancakeswapViemContractFactory } from '../contracts';
import { PancakeswapSyrupCake } from '../contracts/viem';
import { PancakeswapSyrupCakeContract } from '../contracts/viem/PancakeswapSyrupCake';

@PositionTemplate()
export class BinanceSmartChainPancakeswapSyrupCakeContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<PancakeswapSyrupCake> {
  groupLabel = 'Syrup Pools';

  chefAddress = '0x45c54210128a065de780c4b0df3d16664f7f859e';
  chefV2Address = '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapViemContractFactory) protected readonly contractFactory: PancakeswapViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pancakeswapSyrupCake({ address, network: this.network });
  }

  async getPoolLength() {
    return 1;
  }

  async getStakedTokenAddress(contract: PancakeswapSyrupCakeContract) {
    return contract.read.token();
  }

  async getRewardTokenAddress(contract: PancakeswapSyrupCakeContract) {
    return contract.read.token();
  }

  async getTotalAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapSyrupCake>): Promise<BigNumberish> {
    const chefV2 = this.contractFactory.pancakeswapChefV2({ address: this.chefV2Address, network: this.network });
    const poolInfo = await multicall.wrap(chefV2).read.poolInfo([BigInt(0)]);
    const totalAllocPoints = await (poolInfo[4]
      ? chefV2.read.totalRegularAllocPoint()
      : chefV2.read.totalSpecialAllocPoint());
    return totalAllocPoints;
  }

  async getPoolAllocPoints({ multicall }: GetMasterChefDataPropsParams<PancakeswapSyrupCake>) {
    const chefV2 = this.contractFactory.pancakeswapChefV2({ address: this.chefV2Address, network: this.network });
    const poolInfo = await multicall.wrap(chefV2).read.poolInfo([BigInt(0)]);
    const poolAllocPoints = poolInfo[2];
    return poolAllocPoints;
  }

  async getTotalRewardRate({ multicall }: GetMasterChefDataPropsParams<PancakeswapSyrupCake>): Promise<BigNumberish> {
    const chefV2 = this.contractFactory.pancakeswapChefV2({ address: this.chefV2Address, network: this.network });
    const poolInfo = await multicall.wrap(chefV2).read.poolInfo([BigInt(0)]);
    const cakePerBlock = await multicall.wrap(chefV2).read.cakePerBlock([poolInfo[4]]);
    return cakePerBlock;
  }

  async getStakedTokenBalance({ address, contract }: GetMasterChefTokenBalancesParams<PancakeswapSyrupCake>) {
    const [userInfo, pricePerShareRaw] = await Promise.all([
      contract.read.userInfo([address]),
      contract.read.getPricePerFullShare(),
    ]);

    const shares = userInfo[0].toString();
    const userBoostedShare = userInfo[6].toString();
    const pricePerShare = Number(pricePerShareRaw) / 10 ** 18;
    return new BigNumber(shares).times(pricePerShare).minus(userBoostedShare).toFixed(0);
  }

  async getRewardTokenBalance() {
    return 0;
  }
}
