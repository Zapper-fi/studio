import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PoolTogetherV4VaultTokenHelper } from '../helpers/pool-together-v4.vault-token-helper';
import { POOL_TOGETHER_DEFINITION } from '../pool-together.definition';

const appId = POOL_TOGETHER_DEFINITION.id;
const groupId = POOL_TOGETHER_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumPoolTogetherV4VaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PoolTogetherV4VaultTokenHelper)
    private readonly poolTogetherVaultTokenHelper: PoolTogetherV4VaultTokenHelper,
  ) {}

  async getPositions() {
    return this.poolTogetherVaultTokenHelper.getAppTokens({
      network: Network.ETHEREUM_MAINNET,
      prizePoolAddresses: ['0xd89a09084555a7d0abe7b111b1f78dfeddd638be'],
    });
  }
}
