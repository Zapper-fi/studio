import { Inject } from '@nestjs/common';
import { CURVE_DEFINITION } from '@zapper-fi/studio/apps/curve';
import { Network } from '@zapper-fi/types/networks';
import Axios from 'axios';
import { values } from 'lodash';

import { SUSHISWAP_DEFINITION } from '~apps-v3/sushiswap/sushiswap.definition';
import { SWAPR_DEFINITION } from '~apps-v3/swapr/swapr.definition';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { RegisterPositionFetcher } from '~position/position-fetcher.decorator';
import { AppToken, ContractType, PositionFetcher } from '~position/position-fetcher.interface';

import { BADGER_DEFINITION } from '../badger.definition';
import { BadgerApiTokensResponse } from '../ethereum/badger.vault.token-fetcher';
import { BadgerVaultTokenHelper } from '../helpers/badger.vault.token-helper';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.vault.id;
const network = Network.ARBITRUM_MAINNET;

@RegisterPositionFetcher({ appId, groupId, network, type: ContractType.APP_TOKEN, options: { includeInTvl: true } })
export class ArbitrumBadgerVaultTokenFetcher implements PositionFetcher<AppToken> {
  constructor(@Inject(BadgerVaultTokenHelper) private readonly badgerVaultTokenHelper: BadgerVaultTokenHelper) {}

  @CacheOnInterval({
    instance: 'business',
    key: `apps-v3:${network}:${appId}:${groupId}:definitions`,
    timeout: 15 * 60 * 1000,
  })
  async getVaultDefinitions() {
    const { data } = await Axios.get<BadgerApiTokensResponse>('https://api.badger.com/v2/tokens?chain=arbitrum');
    const vaultDefinitions = values(data)
      .filter(t => t.type === 'Vault')
      .map(t => ({ address: t.address.toLowerCase(), underlyingAddress: t.vaultToken.address.toLowerCase() }));
    return vaultDefinitions;
  }

  async getPositions() {
    const vaultDefinitions = await this.getVaultDefinitions();

    return this.badgerVaultTokenHelper.getTokens({
      network,
      definitions: vaultDefinitions,
      dependencies: [
        {
          appId: SUSHISWAP_DEFINITION.id,
          groupIds: [SUSHISWAP_DEFINITION.groups.pool.id],
          network,
        },
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
        {
          appId: SWAPR_DEFINITION.id,
          groupIds: [SWAPR_DEFINITION.groups.pool.id],
          network,
        },
      ],
    });
  }
}
