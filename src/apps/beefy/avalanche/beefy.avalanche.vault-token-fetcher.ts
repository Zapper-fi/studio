import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { STARGATE_DEFINITION } from '~apps/stargate/stargate.definition';
import { TRADER_JOE_DEFINITION } from '~apps/trader-joe';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';
import { BeefyVaultTokensHelper } from '../helpers/beefy.vault-token-fetcher-helper';

const appId = BEEFY_DEFINITION.id;
const groupId = BEEFY_DEFINITION.groups.vault.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheBeefyVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(BeefyVaultTokensHelper) private readonly beefyVaultTokensHelper: BeefyVaultTokensHelper) {}

  getPositions() {
    return this.beefyVaultTokensHelper.getTokenMarketData({
      network,
      dependencies: [
        { appId: 'pangolin', groupIds: ['pool'], network },
        { appId: 'lydia', groupIds: ['pool'], network },
        { appId: TRADER_JOE_DEFINITION.id, groupIds: [TRADER_JOE_DEFINITION.groups.pool.id], network },
        { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
        { appId: STARGATE_DEFINITION.id, groupIds: [STARGATE_DEFINITION.groups.pool.id], network },
        { appId: 'synapse', groupIds: ['pool'], network },
      ],
    });
  }
}
