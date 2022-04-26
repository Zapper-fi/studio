import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CURVE_DEFINITION } from '~apps/curve';
import { YearnLikeVaultTokenHelper } from '~apps/yearn/helpers/yearn-like.vault.token-helper';
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
    @Inject(YearnLikeVaultTokenHelper)
    private readonly yearnVaultTokenHelper: YearnLikeVaultTokenHelper,
    @Inject(PickleApiJarRegistry) private readonly jarRegistry: PickleApiJarRegistry,
  ) {}

  async getPositions() {
    const network = Network.ARBITRUM_MAINNET;
    const vaults = await this.jarRegistry.getJarDefinitions({ network });

    return this.yearnVaultTokenHelper.getTokens<PickleJar>({
      appId: PICKLE_DEFINITION.id,
      groupId: PICKLE_DEFINITION.groups.jar.id,
      network,
      dependencies: [
        {
          appId: CURVE_DEFINITION.id,
          groupIds: [CURVE_DEFINITION.groups.pool.id],
          network,
        },
        // @TODO: Migrate these over
        {
          appId: 'balance-v2',
          groupIds: ['pool'],
          network,
        },
        {
          appId: 'sushiswap',
          groupIds: ['pool'],
          network: Network.ARBITRUM_MAINNET,
        },
      ],
      resolvePrimaryLabel: ({ underlyingToken }) => `${getLabelFromToken(underlyingToken)} Jar`,
      resolvePricePerShare: async ({ multicall, contract }) => multicall.wrap(contract).getRatio(),
      resolvePricePerShareActual: ({ pricePerShareRaw }) => Number(pricePerShareRaw) / 10 ** 18,
      resolveVaultAddresses: async () => vaults.map(({ vaultAddress }) => vaultAddress),
      resolveContract: ({ address, network }) => this.pickleContractFactory.pickleJar({ address, network }),
      resolveApy: async () => 0,
    });
  }
}
