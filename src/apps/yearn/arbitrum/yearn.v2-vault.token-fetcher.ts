import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YearnV2VaultTokenHelper } from '../helpers/yearn.v2-vault.token-helper';
import { YEARN_DEFINITION } from '../yearn.definition';

const appId = YEARN_DEFINITION.id;
const groupId = YEARN_DEFINITION.groups.v2Vault.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class ArbitrumYearnV2VaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(YearnV2VaultTokenHelper) private readonly yearnVaultTokenHelper: YearnV2VaultTokenHelper) {}

  async getPositions() {
    return this.yearnVaultTokenHelper.getTokens({
      network,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
    });
  }
}
