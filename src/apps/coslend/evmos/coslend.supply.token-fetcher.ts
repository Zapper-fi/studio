import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CoslendContractFactory } from '../contracts';
import { COSLEND_DEFINITION } from '../coslend.definition';
import { CoslendSupplyTokenHelper } from '../helper/coslend.supply.token-helper';

const appId = COSLEND_DEFINITION.id;
const groupId = COSLEND_DEFINITION.groups.supply.id;
const network = Network.EVMOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EvmosCoslendSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CoslendContractFactory) private readonly coslendContractFactory: CoslendContractFactory,
    @Inject(CoslendSupplyTokenHelper) private readonly coslendSupplyTokenHelper: CoslendSupplyTokenHelper,
  ) {}

  async getPositions() {
    return this.coslendSupplyTokenHelper.getTokens({
      network,
      appId,
      groupId,
      comptrollerAddress: '0x5b32b588af5f99f4e5c4038dde6bdd991024f650',
      getComptrollerContract: ({ address, network }) =>
        this.coslendContractFactory.coslendComptroller({ address, network }),
      getTokenContract: ({ address, network }) => this.coslendContractFactory.coslendCToken({ address, network }),
      getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
      getExchangeRate: ({ contract, multicall }) => multicall.wrap(contract).exchangeRateCurrent(),
      getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerSecond(),
      getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerSecond(),
      getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
      getExchangeRateMantissa: ({ underlyingTokenDecimals }) => underlyingTokenDecimals + 10,
      oracle: ({ contract, multicall }) => multicall.wrap(contract).oracle(),
    });
  }
}
