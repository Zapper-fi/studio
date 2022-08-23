import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { BALANCER_V1_DEFINITION } from '~apps/balancer-v1';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { CURVE_DEFINITION } from '~apps/curve';
import { OLYMPUS_DEFINITION } from '~apps/olympus';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';
import { BeefyVaultTokensHelper } from '../helpers/beefy.vault-token-fetcher-helper';

const appId = BEEFY_DEFINITION.id;
const groupId = BEEFY_DEFINITION.groups.vault.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumBeefyVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(BeefyVaultTokensHelper) private readonly beefyVaultTokensHelper: BeefyVaultTokensHelper) {}

  getPositions() {
    return this.beefyVaultTokensHelper.getTokenMarketData({
      network,
      dependencies: [
        { appId: 'sushiswap', groupIds: ['pool'], network },
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
        { appId: OLYMPUS_DEFINITION.id, groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id], network },
        { appId: BALANCER_V2_DEFINITION.id, groupIds: [BALANCER_V2_DEFINITION.groups.pool.id], network },
        { appId: BALANCER_V1_DEFINITION.id, groupIds: [BALANCER_V1_DEFINITION.groups.pool.id], network },
      ],
    });
  }
}
