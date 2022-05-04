import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusBridgeTokenHelper } from '../helpers/olympus.bridge-token-helper';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

const ETHEREUM_WRAPED_STAKED_OHM = '0xca76543cf381ebbb277be79574059e32108e3e65';
const WRAPPED_STAKED_OHM = '0x739ca6d71365a08f584c8fc4e1029045fa8abc4b';

@Register.TokenPositionFetcher({
  appId: OLYMPUS_DEFINITION.id,
  groupId: OLYMPUS_DEFINITION.groups.wsOhmV1.id,
  network: Network.ARBITRUM_MAINNET,
})
export class ArbitrumOlympusWsOhmV1TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(OlympusBridgeTokenHelper) private readonly bridgeTokenHelper: OlympusBridgeTokenHelper) {}

  async getPositions() {
    return this.bridgeTokenHelper.getPositions({
      src: { network: Network.ETHEREUM_MAINNET, address: ETHEREUM_WRAPED_STAKED_OHM },
      dest: { network: Network.ARBITRUM_MAINNET, address: WRAPPED_STAKED_OHM },
      appId: OLYMPUS_DEFINITION.id,
      groupId: OLYMPUS_DEFINITION.groups.wsOhmV1.id,
    });
  }
}
