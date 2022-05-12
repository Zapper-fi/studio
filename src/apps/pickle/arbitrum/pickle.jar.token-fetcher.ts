import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { BALANCER_V2_DEFINITION } from '~apps/balancer-v2';
import { CURVE_DEFINITION } from '~apps/curve';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PickleContractFactory, PickleJar } from '../contracts';
import { PickleApiJarRegistry } from '../helpers/pickle.api.jar-registry';
import { PICKLE_DEFINITION } from '../pickle.definition';

@Register.TokenPositionFetcher({
  appId: PICKLE_DEFINITION.id,
  groupId: PICKLE_DEFINITION.groups.jar.id,
  network: Network.ARBITRUM_MAINNET,
})
export class ArbitrumPickleJarTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PickleContractFactory)
    private readonly pickleContractFactory: PickleContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PickleApiJarRegistry) private readonly jarRegistry: PickleApiJarRegistry,
  ) {}

  async getPositions() {
    const network = Network.ARBITRUM_MAINNET;
    const vaults = await this.jarRegistry.getJarDefinitions({ network });

    return this.appToolkit.helpers.vaultTokenHelper.getTokens<PickleJar>({
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.jar.id,
      network,
      dependencies: [
        { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
        { appId: BALANCER_V2_DEFINITION.id, groupIds: [BALANCER_V2_DEFINITION.groups.pool.id], network },
        { appId: 'sushiswap', groupIds: ['pool'], network },
      ],
      resolveContract: ({ address, network }) => this.pickleContractFactory.pickleJar({ address, network }),
      resolveVaultAddresses: async () => vaults.map(({ vaultAddress }) => vaultAddress),
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).token(),
      resolvePrimaryLabel: ({ underlyingToken }) => `${getLabelFromToken(underlyingToken)} Jar`,
      resolvePricePerShare: async ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .getRatio()
          .then(v => Number(v) / 10 ** 18),
      resolveReserve: async ({ underlyingToken, multicall, address }) =>
        multicall
          .wrap(this.appToolkit.globalContracts.erc20(underlyingToken))
          .balanceOf(address)
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolveApy: async () => 0,
    });
  }
}
