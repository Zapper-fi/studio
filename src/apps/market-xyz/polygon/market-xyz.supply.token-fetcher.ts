import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CompoundContractFactory } from '~apps/compound';
import { CompoundSupplyTokenHelper } from '~apps/compound/helper/compound.supply.token-helper';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MarketXyzContractFactory } from '../contracts';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

const appId = MARKET_XYZ_DEFINITION.id;
const groupId = MARKET_XYZ_DEFINITION.groups.supply.id;
const network = Network.POLYGON_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class PolygonMarketXyzSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CompoundContractFactory) private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(CompoundSupplyTokenHelper) private readonly compoundSupplyTokenHelper: CompoundSupplyTokenHelper,
    @Inject(MarketXyzContractFactory) private readonly marketXyzContractFactory: MarketXyzContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const poolDirectoryAddress = '0xa2a1cb88d86a939a37770fe5e9530e8700dee56b';
    const controllerContract = this.marketXyzContractFactory.poolDirectory({ address: poolDirectoryAddress, network });
    const pools = await controllerContract.getAllPools();

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const markets = await Promise.all(
      pools.map(pool => {
        return this.compoundSupplyTokenHelper.getTokens({
          network,
          appId,
          groupId,
          comptrollerAddress: pool.comptroller.toLowerCase(),
          marketName: pool.name,
          allTokens: [...baseTokens],
          getComptrollerContract: ({ address, network }) =>
            this.compoundContractFactory.compoundComptroller({ address, network }),
          getTokenContract: ({ address, network }) => this.compoundContractFactory.compoundCToken({ address, network }),
          getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
          getExchangeRate: async ({ contract, multicall }) =>
            multicall
              .wrap(contract)
              .exchangeRateCurrent()
              .catch(() => 0),
          getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerBlock(),
          getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerBlock(),
          getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
          getExchangeRateMantissa: ({ underlyingTokenDecimals, tokenDecimals }) =>
            18 + underlyingTokenDecimals - tokenDecimals,
          getDisplayLabel: async ({ underlyingToken }) => `${underlyingToken.symbol} in ${pool.name}`,
        });
      }),
    );

    return markets.flat();
  }
}
