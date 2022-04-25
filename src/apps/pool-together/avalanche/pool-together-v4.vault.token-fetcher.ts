import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV4VaultTokenHelper } from '../helpers/pool-together-v4.vault-token-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const groupId = POOL_TOGETHER_DEFINITION.groups.vault.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalanchePoolTogetherV4VaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherV4VaultTokenHelper)
    private readonly poolTogetherVaultTokenHelper: PoolTogetherV4VaultTokenHelper,
  ) {}

  async getPositions() {
    return this.poolTogetherVaultTokenHelper.getAppTokens({
      network: Network.AVALANCHE_MAINNET,
      prizePoolAddresses: ['0xf830f5cb2422d555ec34178e27094a816c8f95ec'],
    });
  }
}
