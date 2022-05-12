import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

import { EthereumSynthetixHoldersCacheManager } from './synthetix.holders.cache-manager';

const appId = SYNTHETIX_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumSynthetixTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(EthereumSynthetixHoldersCacheManager)
    private readonly holdersCacheManager: EthereumSynthetixHoldersCacheManager,
  ) {}

  async getTvl() {
    // Total Locked SNX
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const snxToken = baseTokens.find(v => v.symbol === 'SNX')!;
    const holders = await this.holdersCacheManager.getHolders();
    const totalSNXLockedUSD = sumBy(holders, v => (Number(v.collateral) - Number(v.transferable)) * snxToken.price);

    // Total Staked WETH
    const stakingAddress = '0xc1aae9d18bbe386b102435a8632c8063d31e747c';
    const wethToken = baseTokens.find(v => v.symbol === 'WETH')!;
    const wethContract = this.appToolkit.globalContracts.erc20({ network, address: wethToken.address });
    const totalWETHStakedRaw = await wethContract.balanceOf(stakingAddress);
    const totalWETHStakedUSD = (Number(totalWETHStakedRaw) / 10 ** wethToken.decimals) * wethToken.price;

    return totalSNXLockedUSD + totalWETHStakedUSD;
  }
}
