import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { CompoundSupplyTokenHelper } from '~apps/compound';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BASTION_PROTOCOL_DEFINITION } from '../bastion-protocol.definition';
import { BastionProtocolContractFactory } from '../contracts';

const appId = BASTION_PROTOCOL_DEFINITION.id;
const groupId = BASTION_PROTOCOL_DEFINITION.groups.supply.id;
const network = Network.AURORA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AuroraBastionProtocolSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(CompoundSupplyTokenHelper) private readonly compoundSupplyTokenHelper: CompoundSupplyTokenHelper,
    @Inject(BastionProtocolContractFactory) private readonly bastionProtocolContractFactory: BastionProtocolContractFactory,
  ) { }
  async getPositions() {
    const secondsPerDay = 60 * 60 * 24;
    const [main, aurora, stakednear, multichain,] = await Promise.all([
      this.compoundSupplyTokenHelper.getTokens({
        network,
        appId,
        groupId,
        comptrollerAddress: '0x6De54724e128274520606f038591A00C5E94a1F6',
        getComptrollerContract: ({ address, network }) =>
          this.bastionProtocolContractFactory.bastionProtocolComptroller({ address, network }),
        getTokenContract: ({ address, network }) => this.bastionProtocolContractFactory.bastionProtocolCtoken({ address, network }),
        getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
        getExchangeRate: ({ contract, multicall }) => multicall.wrap(contract).callStatic.exchangeRateCurrent(),
        getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerBlock(),
        getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerBlock(),
        getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
        getExchangeRateMantissa: ({ underlyingTokenDecimals }) => underlyingTokenDecimals + 10,
        getDisplayLabel: async ({ underlyingToken }) => `${underlyingToken.symbol} in Main Hub`,
        getDenormalizedRate: ({ blocksPerDay, rate }) => Math.pow(1 + secondsPerDay * Number(rate), 365) - 1,
      }),
      this.compoundSupplyTokenHelper.getTokens({
        network,
        appId,
        groupId,
        comptrollerAddress: '0xe1cf09BDa2e089c63330F0Ffe3F6D6b790835973',
        getComptrollerContract: ({ address, network }) =>
          this.bastionProtocolContractFactory.bastionProtocolComptroller({ address, network }),
        getTokenContract: ({ address, network }) => this.bastionProtocolContractFactory.bastionProtocolCtoken({ address, network }),
        getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
        getExchangeRate: ({ contract, multicall }) => multicall.wrap(contract).callStatic.exchangeRateCurrent(),
        getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerBlock(),
        getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerBlock(),
        getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
        getExchangeRateMantissa: ({ underlyingTokenDecimals }) => underlyingTokenDecimals + 10,
        getDisplayLabel: async ({ underlyingToken }) => `${underlyingToken.symbol} in Aurora Realm`,
        getDenormalizedRate: ({ blocksPerDay, rate }) => Math.pow(1 + secondsPerDay * Number(rate), 365) - 1,
      }),
      this.compoundSupplyTokenHelper.getTokens({
        network,
        appId,
        groupId,
        comptrollerAddress: '0xE550A886716241AFB7ee276e647207D7667e1E79',
        getComptrollerContract: ({ address, network }) =>
          this.bastionProtocolContractFactory.bastionProtocolComptroller({ address, network }),
        getTokenContract: ({ address, network }) => this.bastionProtocolContractFactory.bastionProtocolCtoken({ address, network }),
        getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
        getExchangeRate: ({ contract, multicall }) => multicall.wrap(contract).callStatic.exchangeRateCurrent(),
        getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerBlock(),
        getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerBlock(),
        getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
        getExchangeRateMantissa: ({ underlyingTokenDecimals }) => underlyingTokenDecimals + 10,
        getDisplayLabel: async ({ underlyingToken }) => `${underlyingToken.symbol} in Staked Near Realm`,
        getDenormalizedRate: ({ blocksPerDay, rate }) => Math.pow(1 + secondsPerDay * Number(rate), 365) - 1,
      }),
      this.compoundSupplyTokenHelper.getTokens({
        network,
        appId,
        groupId,
        comptrollerAddress: '0xA195b3d7AA34E47Fb2D2e5A682DF2d9EFA2daF06',
        getComptrollerContract: ({ address, network }) =>
          this.bastionProtocolContractFactory.bastionProtocolComptroller({ address, network }),
        getTokenContract: ({ address, network }) => this.bastionProtocolContractFactory.bastionProtocolCtoken({ address, network }),
        getAllMarkets: ({ contract, multicall }) => multicall.wrap(contract).getAllMarkets(),
        getExchangeRate: ({ contract, multicall }) => multicall.wrap(contract).callStatic.exchangeRateCurrent(),
        getSupplyRate: ({ contract, multicall }) => multicall.wrap(contract).supplyRatePerBlock(),
        getBorrowRate: ({ contract, multicall }) => multicall.wrap(contract).borrowRatePerBlock(),
        getUnderlyingAddress: ({ contract, multicall }) => multicall.wrap(contract).underlying(),
        getExchangeRateMantissa: ({ underlyingTokenDecimals }) => underlyingTokenDecimals + 10,
        getDisplayLabel: async ({ underlyingToken }) => `${underlyingToken.symbol} in Multichain Realm`,
        getDenormalizedRate: ({ blocksPerDay, rate }) => Math.pow(1 + secondsPerDay * Number(rate), 365) - 1,
      }),
    ])

    const tokens = compact([main, aurora, stakednear, multichain]).flat();
    return tokens;

  }
}
