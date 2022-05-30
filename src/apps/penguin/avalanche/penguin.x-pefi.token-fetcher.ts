import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { PenguinContractFactory } from '../contracts';
import { PenguinXPefi } from '../contracts/ethers/PenguinXPefi';
import { PENGUIN_DEFINITION } from '../penguin.definition';

@Register.TokenPositionFetcher({
  appId: PENGUIN_DEFINITION.id,
  groupId: PENGUIN_DEFINITION.groups.xPefi.id,
  network: Network.AVALANCHE_MAINNET,
})
export class AvalanchePenguinXPefiTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PenguinContractFactory) private readonly contractFactory: PenguinContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<PenguinXPefi>({
      resolveContract: ({ address, network }) => this.contractFactory.penguinXPefi({ address, network }),
      resolveVaultAddresses: () => ['0xd79a36056c271b988c5f1953e664e61416a9820f'],
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).pefi(),
      resolveReserve: ({ underlyingToken, network, address }) =>
        this.appToolkit.globalContracts
          .erc20({ address: underlyingToken.address, network })
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePricePerShare: async ({ reserve, supply }) => reserve / supply,
      appId: PENGUIN_DEFINITION.id,
      groupId: PENGUIN_DEFINITION.groups.xPefi.id,
      network: Network.AVALANCHE_MAINNET,
    });
  }
}
