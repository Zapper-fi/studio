import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YearnV1VaultTokenHelper } from '../helpers/yearn.v1-vault.token-helper';
import { YEARN_DEFINITION } from '../yearn.definition';

const appId = YEARN_DEFINITION.id;
const groupId = YEARN_DEFINITION.groups.v1Vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumYearnV1VaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(YearnV1VaultTokenHelper) private readonly yearnVaultTokenHelper: YearnV1VaultTokenHelper) {}

  async getPositions() {
    return this.yearnVaultTokenHelper.getTokens({
      network,
      dependencies: [
        // @TODO: Move over Aave V1
        { appId: 'aave-v1', groupIds: ['supply'], network },
        { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
      ],
      vaultsToIgnore: ['0xc5bddf9843308380375a611c18b50fb9341f502a'],
    });
  }
}
