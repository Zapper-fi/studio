import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusBridgeTokenHelper } from '../helpers/olympus.bridge-token-helper';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

const ETHEREUM_GOVERNANCE_OHM = '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f';
const GOVERNANCE_OHM = '0x321e7092a180bb43555132ec53aaa65a5bf84251';

@Register.TokenPositionFetcher({
  appId: OLYMPUS_DEFINITION.id,
  groupId: OLYMPUS_DEFINITION.groups.gOhm.id,
  network: Network.AVALANCHE_MAINNET,
})
export class AvalancheOlympusGOhmTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(OlympusBridgeTokenHelper) private readonly bridgeTokenHelper: OlympusBridgeTokenHelper) {}

  async getPositions() {
    return this.bridgeTokenHelper.getPositions({
      src: { network: Network.ETHEREUM_MAINNET, address: ETHEREUM_GOVERNANCE_OHM },
      dest: { network: Network.AVALANCHE_MAINNET, address: GOVERNANCE_OHM },
      appId: OLYMPUS_DEFINITION.id,
      groupId: OLYMPUS_DEFINITION.groups.gOhm.id,
    });
  }
}
