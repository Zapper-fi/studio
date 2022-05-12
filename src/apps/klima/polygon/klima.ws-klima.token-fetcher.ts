import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KlimaContractFactory, KlimaWsKlima } from '../contracts';
import { KLIMA_DEFINITION } from '../klima.definition';

const appId = KLIMA_DEFINITION.id;
const groupId = KLIMA_DEFINITION.groups.wsKlima.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonKlimaWsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(KlimaContractFactory) private readonly contractFactory: KlimaContractFactory,
  ) {}

  async getPositions(): Promise<AppTokenPosition[]> {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<KlimaWsKlima>({
      network,
      appId,
      groupId,
      dependencies: [{ appId, groupIds: [KLIMA_DEFINITION.groups.sKlima.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.klimaWsKlima({ address, network }),
      resolveVaultAddresses: () => ['0x6f370dba99e32a3cad959b341120db3c9e280ba6'], // wsKLIMA
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).sKLIMA(),
      resolveReserve: ({ underlyingToken, network, address }) =>
        this.appToolkit.globalContracts
          .erc20({ address: underlyingToken.address, network })
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
      resolvePrimaryLabel: ({ symbol }) => symbol,
    });
  }
}
