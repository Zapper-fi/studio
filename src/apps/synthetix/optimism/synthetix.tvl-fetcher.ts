import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher';
import { Network } from '~types/network.interface';

import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

import { OptimismSynthetixHoldersCacheManager } from './synthetix.holders.cache-manager';

const appId = SYNTHETIX_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class EthereumSynthetixTvlFetcher extends TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OptimismSynthetixHoldersCacheManager)
    private readonly holdersCacheManager: OptimismSynthetixHoldersCacheManager,
  ) {
    super();
  }

  async getTvl() {
    // Total Locked SNX
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const snxToken = baseTokens.find(v => v.symbol === 'SNX')!;
    const holders = await this.holdersCacheManager.getHolders();
    const totalSNXLockedUSD = sumBy(holders, v => (Number(v.collateral) - Number(v.transferable)) * snxToken.price);

    return totalSNXLockedUSD;
  }
}
