import { Register } from '~app-toolkit/decorators';
import { BalanceFetcher } from '~app/balance-fetcher.interface';
import { Network } from '~types/network.interface';

import { MY_APP_DEFINITION } from '../my-app.definition';

@Register.BalanceFetcher(MY_APP_DEFINITION.id, Network.ETHEREUM_MAINNET)
export class EthereumMyAppBalanceFetcher implements BalanceFetcher {
  async getBalances() {
    return ['whatever', 'balance'];
  }
}
