import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { IMulticallWrapper } from '~multicall/multicall.interface';

import { UniswapFactory, UniswapPair } from '../contracts';

import { UniswapV2PoolTokenHelperParams } from './uniswap-v2.pool.token-helper';

type GetPoolAddressListParams<T = UniswapFactory, V = UniswapPair> = {
  resolvePoolsLength: (opts: { multicall: IMulticallWrapper; factoryContract: T }) => Promise<BigNumberish>;
  resolvePoolAddress: (opts: {
    multicall: IMulticallWrapper;
    factoryContract: T;
    poolIndex: number;
  }) => Promise<string>;
  resolvePoolAddressIsValid?: (opts: { multicall: IMulticallWrapper; poolContract: V }) => Promise<boolean>;
};

@Injectable()
export class UniswapV2OnChainPoolTokenAddressStrategy {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  build<T = UniswapFactory, V = UniswapPair>({
    resolvePoolsLength,
    resolvePoolAddress,
    resolvePoolAddressIsValid,
  }: GetPoolAddressListParams<T, V>): UniswapV2PoolTokenHelperParams<T, V>['resolvePoolTokenAddresses'] {
    return async ({ factoryAddress, network, resolveFactoryContract, resolvePoolContract }) => {
      const multicall = this.appToolkit.getMulticall(network);

      const factoryContract = resolveFactoryContract({ address: factoryAddress, network });
      const poolsLength = await resolvePoolsLength({ multicall, factoryContract });

      const poolAddresses = await Promise.all(
        _.range(0, Number(poolsLength)).map(async poolIndex => {
          const poolAddressRaw = await resolvePoolAddress({ multicall, factoryContract, poolIndex });
          const poolAddress = poolAddressRaw.toLowerCase();
          if (!resolvePoolAddressIsValid) return poolAddress;

          const poolContract = resolvePoolContract({ address: poolAddress, network });
          const isValid = await resolvePoolAddressIsValid({ multicall, poolContract });
          return isValid ? poolAddress : null;
        }),
      );

      return _.compact(poolAddresses);
    };
  }
}
