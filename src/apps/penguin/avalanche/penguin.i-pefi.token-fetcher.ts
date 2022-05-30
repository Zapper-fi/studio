import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { PenguinContractFactory } from '../contracts';
import { PenguinIPefi } from '../contracts/ethers/PenguinIPefi';
import { PENGUIN_DEFINITION } from '../penguin.definition';

@Register.TokenPositionFetcher({
  appId: PENGUIN_DEFINITION.id,
  groupId: PENGUIN_DEFINITION.groups.iPefi.id,
  network: Network.AVALANCHE_MAINNET,
})
export class AvalanchePenguinIPefiTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PenguinContractFactory) private readonly contractFactory: PenguinContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<PenguinIPefi>({
      resolveContract: ({ address, network }) => this.contractFactory.penguinIPefi({ address, network }),
      resolveVaultAddresses: () => ['0xe9476e16fe488b90ada9ab5c7c2ada81014ba9ee'],
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).pefi(),
      resolveReserve: ({ underlyingToken, address, network }) =>
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
