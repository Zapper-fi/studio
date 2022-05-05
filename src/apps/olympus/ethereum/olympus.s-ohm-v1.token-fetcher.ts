import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusContractFactory, OlympusSOhmV1Token } from '../contracts';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

const appId = OLYMPUS_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;
const groupId = OLYMPUS_DEFINITION.groups.sOhmV1.id;

@Register.TokenPositionFetcher({
  appId,
  groupId,
  network,
})
export class EthereumOlympusSOhmV1TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OlympusContractFactory) private readonly contractFactory: OlympusContractFactory,
  ) {}

  getPositions(): Promise<AppTokenPosition[]> {
    return this.appToolkit.helpers.singleVaultTokenHelper.getTokens<OlympusSOhmV1Token>({
      appId: OLYMPUS_DEFINITION.id,
      groupId: OLYMPUS_DEFINITION.groups.gOhm.id,
      network: Network.ETHEREUM_MAINNET,
      address: '0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f', // sOHMv1
      resolveContract: ({ address, network }) => this.contractFactory.olympusSOhmV1Token({ address, network }),
      resolveUnderlyingTokenAddress: () => '0x383518188c0c6d7730d91b2c03a03c837814a899', // OHMv1
      resolvePricePerShare: () => 1,
      resolveImages: () => [getAppImg(OLYMPUS_DEFINITION.id)],
      resolveReserve: ({ underlyingToken, network }) =>
        this.contractFactory
          .erc20({ address: underlyingToken.address, network })
          .balanceOf('0xfd31c7d00ca47653c6ce64af53c1571f9c36566a')
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
    });
  }
}
