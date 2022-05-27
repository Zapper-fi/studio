import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { isSupplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { LyraAvalonContractFactory } from '../contracts';
import { LYRA_AVALON_DEFINITION } from '../lyra-avalon.definition';

import { OPTION_TYPES } from './helpers/consts';
import { getOptions } from './helpers/graph';

const appId = LYRA_AVALON_DEFINITION.id;
const network = Network.OPTIMISM_MAINNET;

@Register.BalanceFetcher(LYRA_AVALON_DEFINITION.id, network)
export class OptimismLyraAvalonBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LyraAvalonContractFactory) private readonly contractFactory: LyraAvalonContractFactory,
  ) {}

  async getPoolBalances(address: string) {
    return await this.appToolkit.helpers.tokenBalanceHelper.getTokenBalances({
      address,
      appId,
      groupId: LYRA_AVALON_DEFINITION.groups.pool.id,
      network,
    });
  }

  async getOptionsBalances(address: string) {
    const multicall = this.appToolkit.getMulticall(network);
    const response = await getOptions(this.appToolkit.helpers.theGraphHelper);
    const markets = await Promise.all(
      response.markets.map(async market => {
        const tokenContract = this.contractFactory.optionToken({
          address: market.optionToken.id.toLowerCase(),
          network,
        });
        const userPositions = await multicall.wrap(tokenContract).getOwnerPositions(address);
        return {
          userPositions,
          marketAddress: market.optionToken.id.toLowerCase(),
          quoteAddress: market.quoteAddress,
          strikes: _.flatten(market.boards.map(board => board.strikes)),
        };
      }),
    );

    return this.appToolkit.helpers.contractPositionBalanceHelper.getContractPositionBalances({
      address,
      appId,
      groupId: LYRA_AVALON_DEFINITION.groups.options.id,
      network,
      resolveBalances: async ({ contractPosition }) => {
        // Find matching market for contract position
        const market = markets.find(market => market.marketAddress === contractPosition.address);
        if (!market?.strikes) return [];

        // Extract information from contract position
        const [, optionType, , strikeId] = (contractPosition.displayProps.secondaryLabel as string).split(' ');
        const collateralToken = contractPosition.tokens.find(isSupplied)!;
        const quoteToken = contractPosition.tokens.find(token => token.address === market.quoteAddress.toLowerCase())!;

        // Find matching user position for contract position
        const userPosition = market.userPositions.find(
          position => Number(position.strikeId) === Number(strikeId) && position.optionType === Number(optionType),
        );
        if (!userPosition) return [];

        // Determine price of the contract position strike
        const strike = market.strikes.find(strike => Number(strike.strikeId) === Number(strikeId));
        if (!strike) return [];
        const price = (OPTION_TYPES[optionType].includes('Call') ? strike.callOption : strike.putOption)
          .latestOptionPriceAndGreeks.optionPrice;
        const balance = ((Number(price) * Number(userPosition.amount)) / 10 ** quoteToken.decimals).toString();

        // Return balance
        // Note: may not be totally accurate
        if (Number(optionType) >= 2) {
          // Short
          const debt = drillBalance(quoteToken, balance, { isDebt: true });
          const collateral = drillBalance(collateralToken, userPosition.collateral.toString());
          return [debt, collateral];
        }
        return [drillBalance(quoteToken, balance)];
      },
    });
  }

  async getBalances(address: string) {
    const [tokenBalances, optionsBalances] = await Promise.all([
      this.getPoolBalances(address),
      this.getOptionsBalances(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Pools',
        assets: tokenBalances,
      },
      {
        label: 'Options',
        assets: optionsBalances,
      },
    ]);
  }
}
