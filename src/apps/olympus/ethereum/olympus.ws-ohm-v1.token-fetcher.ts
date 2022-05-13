import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusContractFactory, OlympusWsOhmV1Token } from '../contracts';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

const appId = OLYMPUS_DEFINITION.id;
const groupId = OLYMPUS_DEFINITION.groups.wsOhmV1.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({
  appId,
  groupId,
  network,
})
export class EthereumOlympusWsOhmV1TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(OlympusContractFactory) private readonly contractFactory: OlympusContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  getPositions(): Promise<AppTokenPosition[]> {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<OlympusWsOhmV1Token>({
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [OLYMPUS_DEFINITION.groups.sOhmV1.id], network }],
      resolveContract: ({ address, network }) => this.contractFactory.olympusWsOhmV1Token({ address, network }),
      resolveVaultAddresses: () => ['0xca76543cf381ebbb277be79574059e32108e3e65'], // wsOHMv1
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).sOHM(),
      resolveImages: () => [getAppImg(appId)],
      resolveReserve: ({ underlyingToken, multicall, address }) =>
        multicall
          .wrap(this.contractFactory.erc20(underlyingToken))
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
    });
  }
}
