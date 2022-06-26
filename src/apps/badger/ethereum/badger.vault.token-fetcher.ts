import { Inject } from '@nestjs/common';
import Axios from 'axios';
import { values } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve/curve.definition';
import { UNISWAP_V2_DEFINITION } from '~apps/uniswap-v2/uniswap-v2.definition';
import { CacheOnInterval } from '~cache/cache-on-interval.decorator';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';
import { BadgerVaultTokenHelper } from '../helpers/badger.vault.token-helper';

const appId = BADGER_DEFINITION.id;
const groupId = BADGER_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

export type BadgerApiTokensResponseEntry = {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  type: string;
  vaultToken: {
    address: string;
    network: string;
  };
};

export type BadgerApiTokensResponse = Record<string, BadgerApiTokensResponseEntry>;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumBadgerVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(BadgerVaultTokenHelper) private readonly badgerVaultTokenHelper: BadgerVaultTokenHelper) {}

  @CacheOnInterval({
    key: `apps-v3:${network}:${appId}:${groupId}:definitions`,
    timeout: 15 * 60 * 1000,
  })
  async getVaultDefinitions() {
    const { data } = await Axios.get<BadgerApiTokensResponse>('https://api.badger.com/v2/tokens?chain=ethereum');
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
        { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
        { appId: 'harvest', groupIds: ['vault'], network },
        { appId: 'sushiswap', groupIds: ['pool'], network },
        { appId: UNISWAP_V2_DEFINITION.id, groupIds: [UNISWAP_V2_DEFINITION.groups.pool.id], network },
      ],
    });
  }
}
