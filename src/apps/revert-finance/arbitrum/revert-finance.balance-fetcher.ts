import { Inject } from '@nestjs/common';
import { getAddress } from 'ethers/lib/utils';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { UniswapV2ContractFactory } from '~apps/uniswap-v2';
import { UniswapV3LiquidityTokenHelper } from '~apps/uniswap-v2/helpers/uniswap-v3.liquidity.token-helper';
import { BalanceFetcher } from '~balance/balance-fetcher.interface';
import { AppTokenPositionBalance, ContractPositionBalance } from '~position/position-balance.interface';
import { Network } from '~types/network.interface';

import { accountBalancesQuery, CompoundorAccountBalances } from '../graphql/accountBalancesQuery';
import { accountCompoundingTokensQuery, CompoundingAccountTokens } from '../graphql/accountCompoundingTokensQuery';
import { generateGraphUrlForNetwork } from '../graphql/graphUrlGenerator';
import { getCompoundorContractPosition } from '../helpers/contractPositionParser';
import { REVERT_FINANCE_DEFINITION } from '../revert-finance.definition';

const network = Network.ARBITRUM_MAINNET;

@Register.BalanceFetcher(REVERT_FINANCE_DEFINITION.id, network)
export class ArbitrumRevertFinanceBalanceFetcher implements BalanceFetcher {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ContractFactory) protected readonly uniswapV2ContractFactory: UniswapV2ContractFactory,
    @Inject(UniswapV3LiquidityTokenHelper)
    private readonly uniswapV3LiquidityTokenHelper: UniswapV3LiquidityTokenHelper,
  ) {}

  async getCompoundorAccountBalances(address: string) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await graphHelper.requestGraph<CompoundorAccountBalances>({
      endpoint: generateGraphUrlForNetwork(network),
      query: accountBalancesQuery,
      variables: { address: getAddress(address) },
    });
    if (!data) return [];
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const accountBalances: Array<ContractPositionBalance> = [];
    data.accountBalances.map(({ token, balance }) => {
      const existingToken = baseTokens.find(item => item.address === token)!;
      if (!token) return [];
      accountBalances.push(getCompoundorContractPosition(network, existingToken, balance));
    });
    return accountBalances;
  }

  async getCompoundingAccountTokens(address: string) {
    const graphHelper = this.appToolkit.helpers.theGraphHelper;
    const data = await graphHelper.requestGraph<CompoundingAccountTokens>({
      endpoint: generateGraphUrlForNetwork(network),
      query: accountCompoundingTokensQuery,
      variables: { address: getAddress(address) },
    });
    if (!data) return [];
    const multicall = this.appToolkit.getMulticall(network);
    const compoundingBalances: Array<AppTokenPositionBalance> = [];
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    await Promise.all(
      data.tokens.map(async ({ id }) => {
        const uniV3Token = await this.uniswapV3LiquidityTokenHelper.getLiquidityToken({
          positionId: id,
          network,
          context: { multicall, baseTokens },
        });
        if (!uniV3Token) return;
        compoundingBalances.push({
          ...drillBalance(uniV3Token, '1'),
          key: this.appToolkit.getPositionKey(uniV3Token, ['supply']),
        });
      }),
    );
    return compoundingBalances;
  }

  async getBalances(address: string) {
    const [compoundorAccountBalances, compoundingAccountBalances] = await Promise.all([
      this.getCompoundorAccountBalances(address),
      this.getCompoundingAccountTokens(address),
    ]);

    return presentBalanceFetcherResponse([
      {
        label: 'Compoundor rewards',
        assets: compoundorAccountBalances,
      },
      {
        label: 'Compounding positions',
        assets: compoundingAccountBalances,
      },
    ]);
  }
}
