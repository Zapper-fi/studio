import { Inject, Injectable } from '@nestjs/common';
import { compact, isNil, isNull, keyBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { BaseToken } from '~position/token.interface';

import { UniswapFactory, UniswapPair } from '../contracts';

import { UniswapV2PoolTokenHelperParams } from './uniswap-v2.pool.token-helper';

type GetDerivedPriceParams<T = UniswapFactory> = {
  priceDerivationWhitelist: string[];
  resolvePoolAddress: (opts: {
    multicall: IMulticallWrapper;
    factoryContract: T;
    token0: string;
    token1: string;
  }) => Promise<string>;
};

@Injectable()
export class UniswapV2OnChainTokenDerivationStrategy {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  build<T = UniswapFactory, V = UniswapPair>({
    priceDerivationWhitelist,
    resolvePoolAddress,
  }: GetDerivedPriceParams<T>): UniswapV2PoolTokenHelperParams<T, V>['resolveDerivedUnderlyingToken'] {
    return async ({
      factoryAddress,
      network,
      tokenAddress,
      resolvePoolUnderlyingTokenAddresses,
      resolveFactoryContract,
      resolvePoolContract,
      resolvePoolReserves,
      tokenDependencySelector,
    }) => {
      const baseTokenMatches = await tokenDependencySelector
        .getMany(priceDerivationWhitelist.map(address => ({ network, address })))
        .then(tokens => compact(tokens))
        .then(tokens => keyBy(tokens, ({ address }) => address));

      const multicall = this.appToolkit.getMulticall(network);
      const factoryContract = resolveFactoryContract({ address: factoryAddress, network });

      const contract = this.appToolkit.globalContracts.erc20({ address: tokenAddress, network });
      const [symbol, decimals] = await Promise.all([
        multicall
          .wrap(contract)
          .symbol()
          .catch(() => null),
        multicall
          .wrap(contract)
          .decimals()
          .catch(() => null),
      ]);

      // For non-ERC20 tokens
      if (isNull(symbol) || isNull(decimals)) {
        return null;
      }

      const baseToken: BaseToken = {
        type: ContractType.BASE_TOKEN,
        address: tokenAddress,
        network: network,
        price: 0,
        symbol: symbol,
        decimals: decimals,
      };

      const derivationResults = await Promise.all(
        priceDerivationWhitelist.map(async knownTokenAddress => {
          const poolAddress = await resolvePoolAddress({
            factoryContract,
            multicall,
            token0: tokenAddress,
            token1: knownTokenAddress,
          });

          if (poolAddress === ZERO_ADDRESS) return null;

          const knownToken = baseTokenMatches[knownTokenAddress];
          if (!knownToken) return null;

          const poolContract = resolvePoolContract({ address: poolAddress, network });
          const tokensRaw = await resolvePoolUnderlyingTokenAddresses({ multicall, poolContract });
          const reserves = await resolvePoolReserves({ multicall, poolContract });
          const tokens = tokensRaw.map(t => t.toLowerCase());

          const unknownIndex = tokens.findIndex(t => t === tokenAddress);
          const knownIndex = 1 - unknownIndex;

          const knownReserve = Number(reserves[knownIndex]) / 10 ** knownToken.decimals;
          const unknownReserve = Number(reserves[unknownIndex]) / 10 ** decimals;
          const knownLiquidity = knownToken.price * knownReserve;
          if (knownLiquidity < 1) return null; // Minimum liquidity check

          const price = knownLiquidity / unknownReserve;
          return { ...baseToken, price };
        }),
      );

      const validDerivationResult = derivationResults.find(dr => !isNil(dr));

      return validDerivationResult ?? baseToken;
    };
  }
}
