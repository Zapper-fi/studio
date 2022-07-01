import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TectonicContractFactory } from '../contracts';
import { TectonicSupplyTokenHelper } from '../helper/tectonic.supply.token-helper';
import { TECTONIC_DEFINITION } from '../tectonic.definition';

const appId = TECTONIC_DEFINITION.id;
const groupId = TECTONIC_DEFINITION.groups.supply.id;
const network = Network.CRONOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class CronosTectonicSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(TectonicContractFactory) private readonly tectonicContractFactory: TectonicContractFactory,
    @Inject(TectonicSupplyTokenHelper) private readonly tectonicSupplyTokenHelper: TectonicSupplyTokenHelper,
  ) {}

  async getPositions() {
    return this.tectonicSupplyTokenHelper.getTokens({
      network,
      appId,
      groupId,
      tectonicCoreAddress: '0xb3831584acb95ed9ccb0c11f677b5ad01deaeec0',
      getTectonicCoreContract: ({ address, network }) =>
        this.tectonicContractFactory.tectonicCore({ address, network }),
      getTokenContract: ({ address, network }) => this.tectonicContractFactory.tectonicTToken({ address, network }),
      getAllMarkets: ({ contract }) => contract.getAllMarkets(),
      getTokenSymbol: ({ contract }) => contract.symbol(),
      getTokenDecimals: ({ contract }) => contract.decimals(),
      getExchangeRate: ({ contract }) => contract.callStatic.exchangeRateCurrent(),
      getSupplyRate: ({ contract }) => contract.supplyRatePerBlock(),
      getBorrowRate: ({ contract }) => contract.borrowRatePerBlock(),
      getTotalSupply: ({ contract }) => contract.totalSupply(),
      getTotalBorrow: ({ contract }) => contract.callStatic.totalBorrowsCurrent(),
      getUnderlyingAddress: ({ contract }) => contract.underlying(),
      getExchangeRateMantissa: ({ underlyingTokenDecimals }) => underlyingTokenDecimals + 10,
    });
  }
}
