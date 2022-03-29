import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MY_APP_DEFINITION } from '../my-app.definition';

@Register.TokenPositionFetcher({
  appId: MY_APP_DEFINITION.id,
  groupId: MY_APP_DEFINITION.groups.pool.id,
  network: Network.ETHEREUM_MAINNET,
})
export class EthereumMyAppPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  // @ts-ignore
  async getPositions() {
    return ['some value 1', 'some value 2'];
  }
}
