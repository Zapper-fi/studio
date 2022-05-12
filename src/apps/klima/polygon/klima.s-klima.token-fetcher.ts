import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KLIMA_DEFINITION } from '../klima.definition';

const appId = KLIMA_DEFINITION.id;
const groupId = KLIMA_DEFINITION.groups.sKlima.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonKlimaSTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getPositions(): Promise<AppTokenPosition[]> {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens({
      network,
      appId,
      groupId,
      resolveVaultAddresses: () => ['0xb0c22d8d350c67420f06f48936654f567c73e8c8'], // sKLIMA
      resolveContract: ({ address, network }) => this.appToolkit.globalContracts.erc20({ address, network }),
      resolveUnderlyingTokenAddress: () => '0x4e78011ce80ee02d2c3e649fb657e45898257815', // KLIMA
      resolveReserve: ({ underlyingToken, network }) =>
        this.appToolkit.globalContracts
          .erc20({ address: underlyingToken.address, network })
          .balanceOf('0x25d28a24ceb6f81015bb0b2007d795acac411b4d')
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: () => 1,
    });
  }
}
