import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { CompoundContractFactory } from '~apps/compound';
import { CompoundSupplyTokenHelper } from '~apps/compound/helper/compound.supply.token-helper';
import { OLYMPUS_DEFINITION } from '~apps/olympus';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MarketXyzContractFactory } from '../contracts';
import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

const appId = MARKET_XYZ_DEFINITION.id;
const groupId = MARKET_XYZ_DEFINITION.groups.supply.id;
const network = Network.AVALANCHE_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheMarketXyzSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CompoundContractFactory) private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(CompoundSupplyTokenHelper) private readonly compoundSupplyTokenHelper: CompoundSupplyTokenHelper,
    @Inject(MarketXyzContractFactory) private readonly marketXyzContractFactory: MarketXyzContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const poolDirectoryAddress = '0x1c4d63bda492d69f2d6b02fb622fb6c49cc401d2';
    const controllerContract = this.marketXyzContractFactory.marketXyzPoolDirectory({
      address: poolDirectoryAddress,
      network,
    });
    const pools = await controllerContract.getAllPools();

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: OLYMPUS_DEFINITION.id,
      groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id],
      network,
    });

    const markets = await Promise.all(
      pools.map(pool => {
        return this.compoundSupplyTokenHelper.getTokens({
          network,
          appId,
          groupId,
          comptrollerAddress: pool.comptroller.toLowerCase(),
          marketName: pool.name,
          allTokens: [...appTokens, ...baseTokens],
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
