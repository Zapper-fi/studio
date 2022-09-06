import { Inject } from '@nestjs/common';

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

export type RookPoolTokenDataProps = {
  reserve: number;
  liquidity: number;
};

export abstract class RookPoolTokenFetcher extends AppTokenTemplatePositionFetcher<RookKToken, RookPoolTokenDataProps> {
  abstract kTokenAddresses: string[];
  abstract liquidityPoolAddress: string;

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

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<RookKToken, RookPoolTokenDataProps>) {
    const pool = this.contractFactory.rookLiquidityPool({ address: this.liquidityPoolAddress, network: this.network });
    const reserveRaw = await multicall.wrap(pool).totalValueLocked(appToken.tokens[0].address);
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    return reserve / appToken.supply;
  }

  async getDataProps({ appToken }: GetDataPropsParams<RookKToken>) {
    const reserve = appToken.pricePerShare[0] * appToken.supply;
    const liquidity = appToken.supply * appToken.price;
    return { reserve, liquidity };
  }
}
