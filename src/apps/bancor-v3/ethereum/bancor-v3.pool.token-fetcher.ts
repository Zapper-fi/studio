import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANCOR_V3_DEFINITION } from '../bancor-v3.definition';
import { BancorV3ContractFactory, BntPool, PoolCollection, PoolToken } from '../contracts';

const appId = BANCOR_V3_DEFINITION.id;
const groupId = BANCOR_V3_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;
const bancorAddress = '0xeEF417e1D5CC832e619ae18D2F140De2999dD4fB'.toLowerCase();
const bntPoolAddress = '0x02651E355D26f3506C1E644bA393FDD9Ac95EaCa'.toLowerCase();

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumBancorV3TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BancorV3ContractFactory) private readonly contractFactory: BancorV3ContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const bancorContract = this.contractFactory.bancorNetwork({ address: bancorAddress, network });
    const poolCollectionAddress = (await multicall.wrap(bancorContract).poolCollections()).at(-1)!; // TODO: support multiple pool collections
    const poolContract: PoolCollection = this.contractFactory.poolCollection({
      address: poolCollectionAddress,
      network,
    });
    const pools = await multicall.wrap(bancorContract).liquidityPools();
    const vaults = await Promise.all(
      pools.map(async pool =>
        multicall
          .wrap(poolContract)
          .poolToken(pool)
          .then(a => a.toLowerCase()),
      ),
    );

    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<PoolToken>({
      appId,
      groupId,
      network,
      dependencies: [{ appId: 'sushiswap', groupIds: ['x-sushi'], network }],
      resolveVaultAddresses: () => vaults,
      resolveContract: ({ address, network }) => this.contractFactory.poolToken({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) =>
        multicall
          .wrap(contract)
          .reserveToken()
          .then(a => (a.toLowerCase() === ETH_ADDR_ALIAS ? ZERO_ADDRESS : a.toLowerCase())),
      resolveReserve: () => 0,
      resolvePricePerShare: ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .reserveToken()
          .then(address =>
            multicall
              .wrap(poolContract)
              .poolTokenToUnderlying(address, (10 ** underlyingToken.decimals).toString())
              .then(ratio => Number(ratio) / 10 ** underlyingToken.decimals),
          ),
    });

    const bntPoolContract = this.contractFactory.bntPool({ address: bntPoolAddress, network });
    const bnToken = await this.appToolkit.helpers.vaultTokenHelper.getTokens<BntPool>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () =>
        multicall
          .wrap(bntPoolContract)
          .poolToken()
          .then(a => [a.toLowerCase()]),
      resolveContract: ({ address, network }) => this.contractFactory.bntPool({ address, network }),
      resolveUnderlyingTokenAddress: () => '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c', // BNT
      resolveReserve: () => 0,
      resolvePricePerShare: ({ multicall, underlyingToken }) =>
        multicall
          .wrap(bntPoolContract)
          .poolTokenToUnderlying((10 ** underlyingToken.decimals).toString())
          .then(ratio => Number(ratio) / 10 ** underlyingToken.decimals),
    });

    return [...tokens, ...bnToken];
  }
}
