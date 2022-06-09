import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types/network.interface';

import { TempusContractFactory, TempusPyToken } from '../contracts';
import { TEMPUS_DEFINITION } from '../tempus.definition';

import { getTempusData, TempusPool } from './tempus.datasource';

const appId = TEMPUS_DEFINITION.id;
const groupId = TEMPUS_DEFINITION.groups.pool.id;

@Injectable()
export class TempusTokensTokenFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TempusContractFactory) private readonly contractFactory: TempusContractFactory,
  ) {}

  async getPoolTokens(data: TempusPool, network: Network) {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<TempusPyToken>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => [data.principalsAddress.toLowerCase(), data.yieldsAddress.toLowerCase()],
      resolveContract: ({ address, network }) => this.contractFactory.tempusPyToken({ address, network }),
      resolveUnderlyingTokenAddress: () => data.backingTokenAddress.toLowerCase(),
      resolveReserve: () => 0,
      resolvePricePerShare: async ({ multicall, contract }) => {
        const decimals = await multicall.wrap(contract).decimals();
        const pricePerShare = await multicall.wrap(contract).getPricePerFullShareStored();
        return Number(pricePerShare) / 10 ** Number(decimals);
      },
    });
  }

  async getPositions(network: Network) {
    const data = await getTempusData(network);
    if (!data) return [];

    const tokens = await Promise.all(data.tempusPools.map(pool => this.getPoolTokens(pool, network)));
    return _.flatten(tokens);
  }
}
