import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { PlatypusFinanceContractFactory, PlatypusFinancePoolToken } from '../contracts';

export type PlatypusFinancePoolTokenDataProps = {
  liquidity: number;
  reserves: number[];
};

export abstract class PlatypusFinancePoolTokenFetcher extends AppTokenTemplatePositionFetcher<
  PlatypusFinancePoolToken,
  PlatypusFinancePoolTokenDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PlatypusFinanceContractFactory) protected readonly contractFactory: PlatypusFinanceContractFactory,
  ) {
    super(appToolkit);
  }

  abstract getPoolAddresses(): Promise<string[]>;

  getContract(address: string): PlatypusFinancePoolToken {
    return this.contractFactory.platypusFinancePoolToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const poolAddresses = await this.getPoolAddresses();

    const tokenAddressesByPool = await Promise.all(
      poolAddresses.map(async poolAddress => {
        const _poolContract = this.contractFactory.platypusFinancePool({ address: poolAddress, network: this.network });
        const poolContract = multicall.wrap(_poolContract);

        const paymentTokenAddresses = await poolContract.getTokenAddresses();
        const tokenAddresses = await Promise.all(paymentTokenAddresses.map(v => poolContract.assetOf(v)));

        return tokenAddresses;
      }),
    );

    return tokenAddressesByPool.flat();
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<PlatypusFinancePoolToken>) {
    return contract.underlyingToken();
  }

  async getPricePerShare({ contract, multicall, appToken }: GetPricePerShareParams<PlatypusFinancePoolToken>) {
    const poolAddress = await contract.pool();
    const _pool = this.contractFactory.platypusFinancePool({ address: poolAddress, network: this.network });
    const pool = multicall.wrap(_pool);

    const amount = new BigNumber(10).pow(appToken.tokens[0].decimals).toFixed(0);
    const pricePerShareRaw = await pool.quotePotentialWithdraw(appToken.tokens[0].address, amount);
    return Number(pricePerShareRaw) / 10 ** appToken.decimals;
  }

  async getDataProps({ appToken }: GetDataPropsParams<PlatypusFinancePoolToken>) {
    const liquidity = appToken.price * appToken.supply;
    const reserves = (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
    return { liquidity, reserves };
  }
}
