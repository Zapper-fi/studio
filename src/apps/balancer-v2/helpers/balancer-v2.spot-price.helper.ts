import { Inject, Injectable } from '@nestjs/common';
import { partition } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { Network } from '~types/network.interface';

import { BalancerV2ContractFactory } from '../contracts';

@Injectable()
export class BalancerV2SpotPriceHelper {
  constructor(
    @Inject(BalancerV2ContractFactory) private readonly balancerV2ContractFactory: BalancerV2ContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getReserves({
    network,
    lpAddress,
    tokens,
    multicall,
  }: {
    network: Network;
    lpAddress: string;

    tokens: string[];
    multicall?: Multicall;
  }) {
    const mc = multicall ?? this.appToolkit.getMulticall(network);

    const poolContract = this.balancerV2ContractFactory.balancerPool({ address: lpAddress, network });
    const poolId = await mc.wrap(poolContract).getPoolId();
    const vaultAddress = '0xba12222222228d8ba445958a75a0704d566bf2c8';
    const vaultContract = this.balancerV2ContractFactory.balancerVault({ address: vaultAddress, network });

    const poolTokens = await mc.wrap(vaultContract).getPoolTokens(poolId);
    const res = poolTokens.tokens.map((v, i) => ({
      tokenAddress: v.toLowerCase(),
      reserveRaw: poolTokens.balances[i],
    }));

    const [[targetToken], [otherToken]] = partition(res, v => v.tokenAddress === tokens[0]);
    return [targetToken.reserveRaw, otherToken.reserveRaw];
  }
}
