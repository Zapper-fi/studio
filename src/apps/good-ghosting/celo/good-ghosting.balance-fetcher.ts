import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { GOOD_GHOSTING_DEFINITION } from '../good-ghosting.definition';
import { NetworkId } from '../helpers/constants';
import { GoodGhostingBalanceFetcherHelper } from '../helpers/good-ghosting.balance-fetcher-helper';

const network = Network.CELO_MAINNET;
const networkId = NetworkId.CeloMainnet;
const appId = GOOD_GHOSTING_DEFINITION.id;
const groupId = GOOD_GHOSTING_DEFINITION.groups.game.id;

@Register.BalanceFetcher(GOOD_GHOSTING_DEFINITION.id, network)
export class CeloGoodGhostingBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingBalanceFetcherHelper) private readonly helper: GoodGhostingBalanceFetcherHelper,
  ) {}

  async getBalances(address: string) {
    const gameBalance = await this.helper.getGameBalances(network, networkId, appId, groupId, address);

    return presentBalanceFetcherResponse([
      {
        label: 'Games',
        assets: [...gameBalance],
      },
    ]);
  }
}
