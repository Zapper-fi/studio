import { Inject, Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { BaseToken } from '~position/token.interface';

import { UniswapFactory, UniswapPair } from '../contracts';

import { UniswapV2PoolTokenHelperParams } from './uniswap-v2.pool.token-helper';

type GetDerivedPriceParams<T = UniswapFactory> = {
  minimumLiquidity: number;
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
        multicall.wrap(contract).symbol(),
        multicall.wrap(contract).decimals(),
      ]);

      const baseToken: BaseToken = {
        type: ContractType.BASE_TOKEN,
        address: tokenAddress,
        symbol: symbol,
        decimals: decimals,
        network: network,
        price: 0,
      };

      for (let i = 0; i < priceDerivationWhitelist.length; i++) {
        const oppositeTokenAddress = priceDerivationWhitelist[i];
        const poolAddress = await resolvePoolAddress({
          factoryContract,
          multicall,
          token0: tokenAddress,
          token1: oppositeTokenAddress,
        });

        if (poolAddress === ZERO_ADDRESS) continue;
        const poolContract = resolvePoolContract({ address: poolAddress, network });
        const tokensRaw = await resolvePoolUnderlyingTokenAddresses({ multicall, poolContract });
        const reserves = await resolvePoolReserves({ multicall, poolContract });
        const tokens = tokensRaw.map(t => t.toLowerCase());

        const index = tokens.findIndex(t => t === tokenAddress);
        const knownIndex = 1 - index;

        const ratio = new BigNumber(reserves[knownIndex].toString()).div(reserves[index].toString()).toNumber();
        const price = baseTokensByAddress[tokens[knownIndex]].price * ratio;
        return { ...baseToken, price };
      }

      return baseToken;
    };
  }
}
