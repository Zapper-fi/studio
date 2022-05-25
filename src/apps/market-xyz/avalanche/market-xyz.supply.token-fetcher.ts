import { Inject } from '@nestjs/common';

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
  ) { }

  async getPositions() {
    const network = Network.AVALANCHE_MAINNET;
    const poolDirectoryAddress = '0x1c4D63bDA492d69f2D6b02Fb622fb6c49cc401d2';
    const controllerContract = this.marketXyzContractFactory.poolDirectory({ address: poolDirectoryAddress, network });
    const pools = await controllerContract.getAllPools();

    const markets = await Promise.all(
      pools.map(pool => {
        return this.compoundSupplyTokenHelper.getTokens({
          network,
          appId,
          groupId,
          comptrollerAddress: pool.comptroller.toLowerCase(),
          marketName: pool.name,
          dependencies: [{ appId: OLYMPUS_DEFINITION.id, groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id], network }],
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
