import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TempusContractFactory, PyToken } from '../contracts';
import { getTempusData, TempusPool } from '../helpers/tempus.datasource';
import { TEMPUS_DEFINITION } from '../tempus.definition';

const appId = TEMPUS_DEFINITION.id;
const groupId = TEMPUS_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumTempusTokensTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TempusContractFactory) private readonly contractFactory: TempusContractFactory,
  ) {}

  async getPoolTokens(data: TempusPool) {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<PyToken>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => [data.principalsAddress.toLowerCase(), data.yieldsAddress.toLowerCase()],
      resolveContract: ({ address, network }) => this.contractFactory.pyToken({ address, network }),
      resolveUnderlyingTokenAddress: () => data.backingTokenAddress.toLowerCase(),
      resolveReserve: () => 0,
      resolvePricePerShare: async ({ multicall, contract }) => {
        const decimals = await multicall.wrap(contract).decimals();
        const pricePerShare = await multicall.wrap(contract).getPricePerFullShareStored();
        return Number(pricePerShare) / 10 ** Number(decimals);
      },
    });
  }

  async getPositions() {
    const data = await getTempusData(network);
    if (!data) return [];

    const tokens = await Promise.all(data.tempusPools.map(pool => this.getPoolTokens(pool)));
    return _.flatten(tokens);
  }
}
