import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YearnVaultTokenHelper } from '../helpers/yearn.vault.token-helper';
import { YEARN_DEFINITION } from '../yearn.definition';

const appId = YEARN_DEFINITION.id;
const groupId = YEARN_DEFINITION.groups.v1Vault.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class FantomYearnV1VaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(YearnVaultTokenHelper) private readonly yearnVaultTokenHelper: YearnVaultTokenHelper) {}

  async getPositions() {
    return this.yearnVaultTokenHelper.getV1Tokens({
      network,
      dependencies: [{ appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network }],
    });
  }
}
