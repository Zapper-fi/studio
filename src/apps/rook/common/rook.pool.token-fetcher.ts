import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { RookContractFactory } from '../contracts';
import { RookKToken } from '../contracts';

export abstract class RookPoolTokenFetcher extends AppTokenTemplatePositionFetcher<RookKToken> {
  abstract kTokenAddresses: string[];
  abstract liquidityPoolAddress: string;
  abstract isV3: boolean;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RookContractFactory) protected readonly contractFactory: RookContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RookKToken {
    return this.contractFactory.rookKToken({ address, network: this.network });
  }

  getAddresses() {
    return this.kTokenAddresses;
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<RookKToken>) {
    const underlying = await contract.underlying();
    return underlying.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<RookKToken>) {
    let reserveRaw: BigNumber;

    if (this.isV3) {
      const pool = this.contractFactory.rookLiquidityPoolV3({
        address: this.liquidityPoolAddress,
        network: this.network,
      });
      const underlyingTokenAddress = appToken.tokens[0].address.replace(ZERO_ADDRESS, ETH_ADDR_ALIAS);
      reserveRaw = await multicall.wrap(pool).totalValueLocked(underlyingTokenAddress);
    } else {
      const pool = this.contractFactory.rookLiquidityPoolV2({
        address: this.liquidityPoolAddress,
        network: this.network,
      });
      const underlyingTokenAddress = appToken.tokens[0].address.replace(ZERO_ADDRESS, ETH_ADDR_ALIAS);
      reserveRaw = await multicall.wrap(pool).borrowableBalance(underlyingTokenAddress);
    }

    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<RookKToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<RookKToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy() {
    return 0;
  }
}
