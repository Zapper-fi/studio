import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KLIMA_DEFINITION } from '../klima.definition';

const appId = KLIMA_DEFINITION.id;
const groupId = KLIMA_DEFINITION.groups.wsKlima.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonKlimaWsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions(): Promise<AppTokenPosition[]> {
    return this.appToolkit.helpers.singleVaultTokenHelper.getTokens({
      network,
      appId,
      groupId,
      dependencies: [{ appId, groupIds: [KLIMA_DEFINITION.groups.sKlima.id], network }],
      address: '0x6f370dba99e32a3cad959b341120db3c9e280ba6', // wsKLIMA
      resolveContract: ({ address, network }) => this.appToolkit.globalContracts.erc20({ address, network }),
      resolveUnderlyingTokenAddress: () => '0xb0c22d8d350c67420f06f48936654f567c73e8c8', // sKLIMA
      resolveReserve: ({ underlyingToken, network }) =>
        this.appToolkit.globalContracts
          .erc20({ address: underlyingToken.address, network })
          .balanceOf('0x6f370dba99e32a3cad959b341120db3c9e280ba6')
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
    });
  }
}
