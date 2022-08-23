import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { BEETHOVEN_X_DEFINITION } from '~apps/beethoven-x';
import { CURVE_DEFINITION } from '~apps/curve';
import { GEIST_DEFINITION } from '~apps/geist/geist.definition';
import { STARGATE_DEFINITION } from '~apps/stargate/stargate.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';
import { BeefyVaultTokensHelper } from '../helpers/beefy.vault-token-fetcher-helper';

const appId = BEEFY_DEFINITION.id;
const groupId = BEEFY_DEFINITION.groups.vault.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomBeefyVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(BeefyVaultTokensHelper) private readonly beefyVaultTokensHelper: BeefyVaultTokensHelper) {}

  getPositions() {
    return this.beefyVaultTokensHelper.getTokenMarketData({
      network,
      dependencies: [
        { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
        { appId: 'spiritswap', groupIds: ['pool'], network },
        { appId: 'spookyswap', groupIds: ['pool'], network },
        { appId: BEETHOVEN_X_DEFINITION.id, groupIds: [BEETHOVEN_X_DEFINITION.groups.pool.id], network },
        { appId: 'tomb', groupIds: ['pool'], network },
        { appId: STARGATE_DEFINITION.id, groupIds: [STARGATE_DEFINITION.groups.pool.id], network },
        { appId: 'sushiswap', groupIds: ['pool'], network },
        { appId: GEIST_DEFINITION.id, groupIds: [GEIST_DEFINITION.groups.supply.id], network },
        { appId: 'scream', groupIds: ['supply'], network },
        { appId: 'scream-v2', groupIds: ['supply'], network },
      ],
    });
  }
}
