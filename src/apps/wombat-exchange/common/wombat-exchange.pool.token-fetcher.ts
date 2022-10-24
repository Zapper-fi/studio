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

import { WombatExchangePoolToken, WombatExchangeContractFactory } from '../contracts';

export abstract class WombatExchangePoolTokenFetcher extends AppTokenTemplatePositionFetcher<WombatExchangePoolToken> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(WombatExchangeContractFactory) protected readonly contractFactory: WombatExchangeContractFactory,
  ) {
    super(appToolkit);
  }

  abstract poolAddresses: string[];

  getContract(address: string): WombatExchangePoolToken {
    return this.contractFactory.wombatExchangePoolToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const tokenAddressesByPool = await Promise.all(
      this.poolAddresses.map(async poolAddress => {
        const _poolContract = this.contractFactory.wombatExchangePool({ address: poolAddress, network: this.network });
        const poolContract = multicall.wrap(_poolContract);

        const paymentTokenAddresses = await poolContract.getTokens();
        const tokenAddresses = await Promise.all(paymentTokenAddresses.map(v => poolContract.addressOfAsset(v)));

        return tokenAddresses;
      }),
    );

    return tokenAddressesByPool.flat();
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<WombatExchangePoolToken>) {
    return contract.underlyingToken();
  }

  async getPricePerShare({ contract, multicall, appToken }: GetPricePerShareParams<WombatExchangePoolToken>) {
    const poolAddress = await contract.pool();
    const _pool = this.contractFactory.wombatExchangePool({ address: poolAddress, network: this.network });
    const pool = multicall.wrap(_pool);

    const amount = new BigNumber(10).pow(appToken.tokens[0].decimals).toFixed(0);
    const pricePerShareRaw = await pool.quotePotentialWithdraw(appToken.tokens[0].address, amount);
    return Number(pricePerShareRaw.amount) / 10 ** appToken.decimals;
  }

  getLiquidity({ appToken }: GetDataPropsParams<WombatExchangePoolToken>) {
    return appToken.supply * appToken.price;
  }

  getReserves({ appToken }: GetDataPropsParams<WombatExchangePoolToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  getApy(_params: GetDataPropsParams<WombatExchangePoolToken>) {
    return 0;
  }
}
