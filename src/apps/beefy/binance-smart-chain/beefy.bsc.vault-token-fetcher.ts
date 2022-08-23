import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { BISWAP_DEFINITION } from '~apps/biswap';
import { PANCAKESWAP_DEFINITION } from '~apps/pancakeswap';
import { STARGATE_DEFINITION } from '~apps/stargate/stargate.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BEEFY_DEFINITION } from '../beefy.definition';
import { BeefyVaultTokensHelper } from '../helpers/beefy.vault-token-fetcher-helper';

const appId = BEEFY_DEFINITION.id;
const groupId = BEEFY_DEFINITION.groups.vault.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainBeefyVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(BeefyVaultTokensHelper) private readonly beefyVaultTokensHelper: BeefyVaultTokensHelper) {}

  getPositions() {
    return this.beefyVaultTokensHelper.getTokenMarketData({
      network,
      dependencies: [
        { appId: PANCAKESWAP_DEFINITION.id, groupIds: [PANCAKESWAP_DEFINITION.groups.pool.id], network },
        { appId: 'apeswap', groupIds: ['pool'], network },
        { appId: 'venus', groupIds: ['supply'], network },
        {
          appId: 'belt',
          groupIds: ['pool', 'vault'],
          network,
        },
        { appId: STARGATE_DEFINITION.id, groupIds: [STARGATE_DEFINITION.groups.pool.id], network },
        { appId: BISWAP_DEFINITION.id, groupIds: [BISWAP_DEFINITION.groups.pool.id], network },
      ],
    });
  }
}
