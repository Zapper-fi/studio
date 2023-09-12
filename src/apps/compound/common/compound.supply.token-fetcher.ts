import { BigNumberish, Contract } from 'ethers';

import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { BalanceDisplayMode, DisplayProps, StatsItem } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

export type GetMarketsParams<S> = GetAddressesParams & {
  contract: S;
};

export type CompoundSupplyTokenDataProps = DefaultAppTokenDataProps & {
  exchangeRate: number;
};

export abstract class CompoundSupplyTokenFetcher<
  R extends Contract,
  S extends Contract,
> extends AppTokenTemplatePositionFetcher<R> {
  protected isExchangeable = false;

  abstract comptrollerAddress: string;

  abstract getCompoundCTokenContract(address: string): R;
  abstract getCompoundComptrollerContract(address: string): S;

  abstract getMarkets(params: GetMarketsParams<S>): Promise<string[]>;
  abstract getUnderlyingAddress(params: GetUnderlyingTokensParams<R>): Promise<string>;
  abstract getExchangeRate(params: GetPricePerShareParams<R, CompoundSupplyTokenDataProps>): Promise<BigNumberish>;
  abstract getSupplyRate(params: GetDataPropsParams<R, CompoundSupplyTokenDataProps>): Promise<BigNumberish>;

  getContract(address: string): R {
    return this.getCompoundCTokenContract(address);
  }

  async getAddresses(params: GetAddressesParams) {
    const comptroller = this.getCompoundComptrollerContract(this.comptrollerAddress);
    return this.getMarkets({ ...params, contract: comptroller });
  }

  async getUnderlyingTokenDefinitions(params: GetUnderlyingTokensParams<R>) {
    const underlyingAddressRaw = await this.getUnderlyingAddress(params).catch(err => {
      // if the underlying call failed, it's the compound-wrapped native token
      if (isMulticallUnderlyingError(err)) return ZERO_ADDRESS;
      throw err;
    });

    const underlyingAddress = underlyingAddressRaw.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
    return [{ address: underlyingAddress, network: this.network }];
  }

  async getExchangeRateMantissa(params: GetPricePerShareParams<R, CompoundSupplyTokenDataProps>) {
    const { appToken } = params;
    const [underlyingToken] = appToken.tokens;
    return underlyingToken.decimals + 10;
  }

  async getPricePerShare(params: GetPricePerShareParams<R, CompoundSupplyTokenDataProps>) {
    const [rateRaw, mantissa] = await Promise.all([this.getExchangeRate(params), this.getExchangeRateMantissa(params)]);
    return [Number(rateRaw) / 10 ** mantissa];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<R, CompoundSupplyTokenDataProps>): Promise<DisplayProps['label']> {
    const [underlyingToken] = appToken.tokens;
    return underlyingToken.symbol;
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<R, CompoundSupplyTokenDataProps>): Promise<DisplayProps['labelDetailed']> {
    return appToken.symbol;
  }

  async getBalanceDisplayMode(_params: GetDisplayPropsParams<R>): Promise<DisplayProps['balanceDisplayMode']> {
    return BalanceDisplayMode.UNDERLYING;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<R, CompoundSupplyTokenDataProps>) {
    return appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<R, CompoundSupplyTokenDataProps>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(params: GetDataPropsParams<R, CompoundSupplyTokenDataProps>) {
    const supplyRate = await this.getSupplyRate(params);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    return 100 * (Math.pow(1 + (blocksPerDay * Number(supplyRate)) / Number(1e18), 365) - 1);
  }

  async getDataProps(
    params: GetDataPropsParams<R, CompoundSupplyTokenDataProps>,
  ): Promise<CompoundSupplyTokenDataProps> {
    const defaultDataProps = await super.getDataProps(params);

    const exchangeRate = await this.getPricePerShare(params);
    return { ...defaultDataProps, exchangeRate: exchangeRate[0] };
  }

  async getStatsItems({
    appToken,
  }: GetDisplayPropsParams<R, CompoundSupplyTokenDataProps>): Promise<StatsItem[] | undefined> {
    const { apy, liquidity, exchangeRate } = appToken.dataProps;
    const exchangeRateFormatted = `${(1 / exchangeRate).toFixed(3)} ${appToken.symbol} = 1 ${
      appToken.tokens[0].symbol
    }`;

    return [
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Exchange Rate', value: buildStringDisplayItem(exchangeRateFormatted) },
    ];
  }
}
