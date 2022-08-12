import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CompoundContractFactory } from '~apps/compound';
import { RariFuseContractFactory, RariFuseSupplyTokenHelper } from '~apps/rari-fuse';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MARKET_XYZ_DEFINITION } from '../market-xyz.definition';

const appId = MARKET_XYZ_DEFINITION.id;
const groupId = MARKET_XYZ_DEFINITION.groups.supply.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomMarketXyzSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CompoundContractFactory) private readonly compoundContractFactory: CompoundContractFactory,
    @Inject(RariFuseContractFactory) private readonly contractFactory: RariFuseContractFactory,
    @Inject(RariFuseSupplyTokenHelper) private readonly rariFuseSupplyTokenHelper: RariFuseSupplyTokenHelper,
  ) {}

  async getPositions() {
    return this.rariFuseSupplyTokenHelper.getTokens({
      network,
      appId,
      groupId,
      poolDirectoryAddress: '0x0e7d754a8d1a82220432148c10715497a0569bd7',
      getRariFusePoolsDirectory: ({ address, network }) =>
        this.contractFactory.rariFusePoolsDirectory({ address, network }),
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
      getDisplayLabel: async ({ underlyingToken, marketName }) => `${underlyingToken.symbol} in ${marketName}`,
    });
  }
}
