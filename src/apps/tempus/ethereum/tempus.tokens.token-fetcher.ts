import { Inject } from '@nestjs/common';
import Axios from 'axios';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TempusContractFactory, PyToken } from '../contracts';
import { TEMPUS_DEFINITION } from '../tempus.definition';

const appId = TEMPUS_DEFINITION.id;
const groupId = TEMPUS_DEFINITION.groups.pools.id;
const network = Network.ETHEREUM_MAINNET;

const datasourceUrl = 'https://raw.githubusercontent.com/tempus-finance/tempus-pools-config/master/config.json'

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumTempusTokensTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TempusContractFactory) private readonly contractFactory: TempusContractFactory,
  ) { }

  async getPoolTokens(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const pool = this.contractFactory.pool({ address, network })

    const matured = await multicall.wrap(pool).matured()
    if (matured) return []

    const [principalAddress, yieldAddress, backingAddress] = await Promise.all([
      multicall.wrap(pool).principalShare(),
      multicall.wrap(pool).yieldShare(),
      multicall.wrap(pool).backingToken(), // Should probably be yieldBearingToken, but that may have dependency issues in the future
    ])

    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<PyToken>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => [principalAddress, yieldAddress],
      resolveContract: ({ address, network }) => this.contractFactory.pyToken({ address, network }),
      resolveUnderlyingTokenAddress: () => backingAddress,
      resolveReserve: () => 0,
      resolvePricePerShare: async ({ multicall, contract }) => {
        const decimals = await multicall.wrap(contract).decimals();
        const pricePerShare = await multicall.wrap(contract).getPricePerFullShareStored()
        return Number(pricePerShare) / (10 ** Number(decimals))
      }
    });
  }

  async getPositions() {
    const pools = (await Axios.get(datasourceUrl)).data[network]
    if (!pools) return []
    const tokens = await Promise.all(pools.tempusPools.map(async (pool) => this.getPoolTokens(pool.address)))
    return _.flatten(tokens)
  }
}
