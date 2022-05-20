import { Inject, Injectable } from '@nestjs/common';
import { isNull } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { BaseToken } from '~position/token.interface';

import { UniswapFactory, UniswapPair } from '../contracts';

import { UniswapV2PoolTokenHelperParams } from './uniswap-v2.pool.token-helper';

type GetDerivedPriceParams<T = UniswapFactory> = {
  priceDerivationWhitelist: string[];
  resolvePoolAddress: (opts: {
    multicall: Multicall;
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
      baseTokensByAddress,
      resolvePoolUnderlyingTokenAddresses,
      resolveFactoryContract,
      resolvePoolContract,
      resolvePoolReserves,
    }) => {
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

      for (let i = 0; i < priceDerivationWhitelist.length; i++) {
        const knownTokenAddress = priceDerivationWhitelist[i];
        const poolAddress = await resolvePoolAddress({
          factoryContract,
          multicall,
          token0: tokenAddress,
          token1: knownTokenAddress,
        });

        if (poolAddress === ZERO_ADDRESS) continue;
        const knownToken = baseTokensByAddress[knownTokenAddress];
        const poolContract = resolvePoolContract({ address: poolAddress, network });
        const tokensRaw = await resolvePoolUnderlyingTokenAddresses({ multicall, poolContract });
        const reserves = await resolvePoolReserves({ multicall, poolContract });
        const tokens = tokensRaw.map(t => t.toLowerCase());

        const unknownIndex = tokens.findIndex(t => t === tokenAddress);
        const knownIndex = 1 - unknownIndex;

        const knownReserve = Number(reserves[knownIndex]) / 10 ** knownToken.decimals;
        const unknownReserve = Number(reserves[unknownIndex]) / 10 ** decimals;
        const knownLiquidity = knownToken.price * knownReserve;
        if (knownLiquidity < 1) continue; // Minimum liquidity check

        const price = knownLiquidity / unknownReserve;
        return { ...baseToken, price };
      }

      return baseToken;
    };
  }
}
