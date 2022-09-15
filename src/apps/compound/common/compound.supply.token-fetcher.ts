import { BigNumberish, Contract } from 'ethers';

import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { BalanceDisplayMode, DisplayProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

export abstract class CompoundSupplyTokenFetcher<
  R extends Contract,
  S extends Contract,
> extends AppTokenTemplatePositionFetcher<R> {
  protected isExchangeable = false;

  abstract comptrollerAddress: string;

  abstract getCompoundCTokenContract(address: string): R;
  abstract getCompoundComptrollerContract(address: string): S;

  abstract getMarkets(contract: S): Promise<string[]>;
  abstract getUnderlyingAddress(contract: R): Promise<string>;
  abstract getExchangeRate(contract: R): Promise<BigNumberish>;
  abstract getSupplyRate(contract: R): Promise<BigNumberish>;

  getContract(address: string): R {
    return this.getCompoundCTokenContract(address);
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const comptroller = this.getCompoundComptrollerContract(this.comptrollerAddress);
    return this.getMarkets(multicall.wrap(comptroller));
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<R>) {
    const underlyingAddressRaw = await this.getUnderlyingAddress(contract).catch(err => {
      // if the underlying call failed, it's the compound-wrapped native token
      if (isMulticallUnderlyingError(err)) return ZERO_ADDRESS;
      throw err;
    });

    return underlyingAddressRaw.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
  }

  async getExchangeRateMantissa(opts: GetPricePerShareParams<R>) {
    const { appToken } = opts;
    const [underlyingToken] = appToken.tokens;
    return underlyingToken.decimals + 10;
  }

  async getPricePerShare(opts: GetPricePerShareParams<R>) {
    const { contract } = opts;
    const [rateRaw, mantissa] = await Promise.all([this.getExchangeRate(contract), this.getExchangeRateMantissa(opts)]);
    return Number(rateRaw) / 10 ** mantissa;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<R>): Promise<DisplayProps['label']> {
    const [underlyingToken] = appToken.tokens;
    return underlyingToken.symbol;
  }

  async getLabelDetailed({ appToken }: GetDisplayPropsParams<R>): Promise<DisplayProps['labelDetailed']> {
    return appToken.symbol;
  }

  async getBalanceDisplayMode(_params: GetDisplayPropsParams<R>): Promise<DisplayProps['balanceDisplayMode']> {
    return BalanceDisplayMode.UNDERLYING;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<R>) {
    return appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<R>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ contract }: GetDataPropsParams<R>) {
    const supplyRate = await this.getSupplyRate(contract);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    return 100 * (Math.pow(1 + (blocksPerDay * Number(supplyRate)) / Number(1e18), 365) - 1);
  }
}
