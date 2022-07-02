import { Register } from '~app-toolkit/decorators';
import { PositionBalanceFetcher } from '~position/position-balance-fetcher.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import LIDO_DEFINITION from '../lido.definition';

const appId = LIDO_DEFINITION.id;
const groupId = LIDO_DEFINITION.groups.steth.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionBalanceFetcher({ appId, groupId, network })
export class EthereumLidoStethTokenBalanceFetcher implements PositionBalanceFetcher<AppTokenPositionBalance> {
  async getBalances(_address: string) {
    // Already counted in base tokens, remove double count
    return [];
  }
}
