import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { OptimismSynthetixHoldersCacheManager } from '~apps/synthetix/optimism/synthetix.holders.cache-manager';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { TvlFetcher } from '~stats/tvl/tvl-fetcher.interface';
import { Network } from '~types/network.interface';

import { THALES_DEFINITION } from '../thales.definition';

const appId = THALES_DEFINITION.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TvlFetcher({ appId, network })
export class OptimismThalesTvlFetcher implements TvlFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OptimismSynthetixHoldersCacheManager)
    private readonly holdersCacheManager: OptimismSynthetixHoldersCacheManager,
  ) {}

  async getTvl() {
    // Total Locked SNX
    // const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    // const thalesToken = baseTokens.find(v => v.symbol === 'Thales')!;
    // const holders = await this.holdersCacheManager.getHolders();
    // const totalThalesLockedUSD = sumBy(holders, v => (Number(v.collateral) - Number(v.transferable)) * thalesToken.price);

    // return totalThalesLockedUSD;
    return 500;
  }
}
