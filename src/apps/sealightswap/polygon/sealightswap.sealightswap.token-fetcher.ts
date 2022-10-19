import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SealightswapContractFactory } from '../contracts';
import { SEALIGHTSWAP_DEFINITION } from '../sealightswap.definition';
import { UniswapV2TheGraphPoolTokenAddressStrategy } from "~apps/uniswap-v2/helpers/uniswap-v2.the-graph.pool-token-address-strategy";

const appId = SEALIGHTSWAP_DEFINITION.id;
const groupId = SEALIGHTSWAP_DEFINITION.groups.sealightswap.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonSealightswapSealightswapTokenFetcher 
  implements PositionFetcher<AppTokenPosition> 
{
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject( SealightswapContractFactory)
    private readonly sealightswapContractFactory:  SealightswapContractFactory,
    @Inject(UniswapV2PoolTokenHelper)
    private readonly uniswapV2PoolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2TheGraphPoolTokenAddressStrategy)
    private readonly uniswapV2TheGraphPoolTokenAddressStrategy: UniswapV2TheGraphPoolTokenAddressStrategy
  ) {}

  async getPositions() {
    return this.uniswapV2PoolTokenHelper.getTokens<SealightswapPoolFactory>({
      network: Network.POLYGON_MAINNET,
      appId: SEALIGHTSWAP_DEFINITION.id,
      groupId: SEALIGHTSWAP_DEFINITION.groups.pool.id,
      dependencies: [
        {
          appId: SEALIGHTSWAP_DEFINITION.id,
          groupIds: [SEALIGHTSWAP_DEFINITION.groups.sAvax.id],
          network: Network.POLYGON_MAINNET,
        },
      ],
      factoryAddress: "0xd0B30Fc63169bAaa3702ad7ec33EBe3f9e8627c0",
      resolveFactoryContract: ({ address, network }) =>
        this.sealightswapContractFactory.sealightswapPoolFactory({
          address,
          network,
        }),
      resolvePoolContract: ({ address, network }) =>
        this.sealightswapContractFactory.sealightswapPool({ address, network }),
      resolvePoolTokenAddresses:
        this.uniswapV2TheGraphPoolTokenAddressStrategy.build({
          subgraphUrl:
            "https://api.thegraph.com/subgraphs/name/nikomatt69/sealightswap2",
          first: 500,
        }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) =>
        multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) =>
        multicall.wrap(poolContract).totalSupply(),
      resolvePoolUnderlyingTokenAddresses: async ({
        multicall,
        poolContract,
      }) =>
        Promise.all([
          multicall.wrap(poolContract).token0(),
          multicall.wrap(poolContract).token1(),
        ]),
      resolvePoolReserves: async ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .getReserves()
          .then((v) => [v._reserve0, v._reserve1]),
    });
  }
}
