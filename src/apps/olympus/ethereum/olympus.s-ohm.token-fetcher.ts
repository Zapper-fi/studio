import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusContractFactory, OlympusSOhmToken } from '../contracts';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

const appId = OLYMPUS_DEFINITION.id;
const groupId = OLYMPUS_DEFINITION.groups.sOhm.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({
  appId,
  groupId,
  network,
})
export class EthereumOlympusSOhmTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) private readonly contractFactory: OlympusContractFactory,
  ) {}

  getPositions(): Promise<AppTokenPosition[]> {
    return this.appToolkit.helpers.singleVaultTokenHelper.getTokens<OlympusSOhmToken>({
      appId: OLYMPUS_DEFINITION.id,
      groupId: OLYMPUS_DEFINITION.groups.gOhm.id,
      network: Network.ETHEREUM_MAINNET,
      address: '0x04906695d6d12cf5459975d7c3c03356e4ccd460', // sOHM
      resolveContract: ({ address, network }) => this.contractFactory.olympusSOhmToken({ address, network }),
      resolveUnderlyingTokenAddress: () => '0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5', // OHM
      resolvePricePerShare: () => 1,
      resolveImages: () => [getAppImg(OLYMPUS_DEFINITION.id)],
      resolveReserve: ({ underlyingToken, network }) =>
        this.contractFactory
          .erc20({ address: underlyingToken.address, network })
          .balanceOf('0xb63cac384247597756545b500253ff8e607a8020')
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
    });
  }
}
