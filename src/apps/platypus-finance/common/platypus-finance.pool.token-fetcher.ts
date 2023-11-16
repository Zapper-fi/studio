import { Inject } from '@nestjs/common';
import { BigNumber } from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { PlatypusFinanceViemContractFactory } from '../contracts';
import { PlatypusFinancePoolToken } from '../contracts/viem';

export abstract class PlatypusFinancePoolTokenFetcher extends AppTokenTemplatePositionFetcher<PlatypusFinancePoolToken> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlatypusFinanceViemContractFactory) protected readonly contractFactory: PlatypusFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  abstract poolAddresses: string[];

  getContract(address: string) {
    return this.contractFactory.platypusFinancePoolToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const tokenAddressesByPool = await Promise.all(
      this.poolAddresses.map(async poolAddress => {
        const _poolContract = this.contractFactory.platypusFinancePool({ address: poolAddress, network: this.network });
        const poolContract = multicall.wrap(_poolContract);

        const paymentTokenAddresses = await poolContract.read.getTokenAddresses();
        const tokenAddresses = await Promise.all(paymentTokenAddresses.map(v => poolContract.read.assetOf([v])));

        return tokenAddresses;
      }),
    );

    return tokenAddressesByPool.flat();
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<PlatypusFinancePoolToken>) {
    return [{ address: await contract.read.underlyingToken(), network: this.network }];
  }

  async getPricePerShare({ contract, multicall, appToken }: GetPricePerShareParams<PlatypusFinancePoolToken>) {
    const poolAddress = await contract.read.pool();
    const _pool = this.contractFactory.platypusFinancePool({ address: poolAddress, network: this.network });
    const pool = multicall.wrap(_pool);

    const amount = new BigNumber(10).pow(appToken.tokens[0].decimals).toFixed(0);
    const [pricePerShareRaw] = await pool.read.quotePotentialWithdraw([appToken.tokens[0].address, BigInt(amount)]);
    const pricePerShare = Number(pricePerShareRaw) / 10 ** appToken.decimals;
    return [pricePerShare];
  }
}
