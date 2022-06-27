import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { UniswapV2PoolTokenHelper, UniswapV2TheGraphPoolTokenAddressStrategy } from '~apps/uniswap-v2';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CronusFinanceContractFactory } from '../contracts';
import { CRONUS_FINANCE_DEFINITION } from '../cronus-finance.definition';

const appId = CRONUS_FINANCE_DEFINITION.id;
const groupId = CRONUS_FINANCE_DEFINITION.groups.pool.id;
const network = Network.EVMOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EvmosCronusFinancePoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CronusFinanceContractFactory) private readonly cronusFinanceContractFactory: CronusFinanceContractFactory,
    @Inject(UniswapV2PoolTokenHelper)
    private readonly uniswapV2PoolTokenHelper: UniswapV2PoolTokenHelper,
    @Inject(UniswapV2TheGraphPoolTokenAddressStrategy)
    private readonly uniswapV2TheGraphPoolTokenAddressStrategy: UniswapV2TheGraphPoolTokenAddressStrategy,
  ) {}

  async getPositions() {
    return this.uniswapV2PoolTokenHelper.getTokens({
      network: Network.EVMOS_MAINNET,
      appId,
      groupId,
      factoryAddress: '0x20570b7bFf86B2f92068622D0805160f318554Be',
      resolveFactoryContract: ({ address, network }) =>
        this.cronusFinanceContractFactory.cronusFinancePoolFactory({
          address,
          network,
        }),
      resolvePoolContract: ({ address, network }) =>
        this.cronusFinanceContractFactory.cronusFinancePool({ address, network }),
      resolvePoolTokenAddresses: this.uniswapV2TheGraphPoolTokenAddressStrategy.build({
        subgraphUrl: 'https://thegraph.cronusfinancexyz.com/subgraphs/name/exchange',
        first: 500,
      }),
      resolvePoolTokenSymbol: ({ multicall, poolContract }) => multicall.wrap(poolContract).symbol(),
      resolvePoolTokenSupply: ({ multicall, poolContract }) => multicall.wrap(poolContract).totalSupply(),
      resolvePoolUnderlyingTokenAddresses: async ({ multicall, poolContract }) =>
        Promise.all([multicall.wrap(poolContract).token0(), multicall.wrap(poolContract).token1()]),
      resolvePoolReserves: async ({ multicall, poolContract }) =>
        multicall
          .wrap(poolContract)
          .getReserves()
          .then(v => [v._reserve0, v._reserve1]),
    });
  }
}
