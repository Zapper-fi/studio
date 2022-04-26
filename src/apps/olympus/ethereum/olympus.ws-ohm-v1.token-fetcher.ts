import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusContractFactory } from '../contracts';
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
    return this.appToolkit.helpers.singleVaultTokenHelper.getTokens({
      appId,
      groupId,
      network,
      dependencies: [{ appId, groupIds: [OLYMPUS_DEFINITION.groups.sOhmV1.id], network }],
      address: '0xca76543cf381ebbb277be79574059e32108e3e65', // wsOHMv1
      resolveContract: ({ address, network }) => this.contractFactory.olympusWsOhmV1Token({ address, network }),
      resolveUnderlyingTokenAddress: () => '0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f', // sOHMv1
      resolveImages: () => [getAppImg(appId)],
      resolvePricePerShare: ({ reserve, supply }) => reserve / supply,
    });
  }
}
