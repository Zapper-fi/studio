import { Inject } from '@nestjs/common';
<<<<<<< HEAD
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
=======

>>>>>>> 84ff57d00a4e4cd08b15494fdd0541bf614c9614
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
<<<<<<< HEAD
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GoodGhostingBalanceFetcherHelper) private readonly helper: GoodGhostingBalanceFetcherHelper,
  ) {}
=======
  constructor(@Inject(GoodGhostingBalanceFetcherHelper) private readonly helper: GoodGhostingBalanceFetcherHelper) {}
>>>>>>> 84ff57d00a4e4cd08b15494fdd0541bf614c9614

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
