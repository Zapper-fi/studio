import { BigNumberish, Contract } from 'ethers';

import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { BalanceDisplayMode, DisplayProps } from '~position/display.interface';
import { ExchangeableAppTokenDataProps } from '~position/position.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

export type CompoundSupplyTokenDataProps = ExchangeableAppTokenDataProps & {
  apy: number;
  liquidity: number;
};

export abstract class CompoundSupplyTokenFetcher<
  R extends Contract,
  S extends Contract,
> extends AppTokenTemplatePositionFetcher<R, CompoundSupplyTokenDataProps> {
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

  protected getDenormalizedRate({
    blocksPerDay,
    rate,
  }: {
    rate: BigNumberish;
    blocksPerDay: number;
    decimals: number;
  }): number {
    return 100 * (Math.pow(1 + (blocksPerDay * Number(rate)) / Number(1e18), 365) - 1);
  }

  protected async getExchangeRateMantissa(opts: GetPricePerShareParams<R, CompoundSupplyTokenDataProps>) {
    const { appToken } = opts;
    const [underlyingToken] = appToken.tokens;
    return underlyingToken.decimals + 10;
  }

  protected async getPricePerShare(opts: GetPricePerShareParams<R, CompoundSupplyTokenDataProps>) {
    const { contract } = opts;
    const [rateRaw, mantissa] = await Promise.all([this.getExchangeRate(contract), this.getExchangeRateMantissa(opts)]);
    return Number(rateRaw) / 10 ** mantissa;
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

  async getBalanceDisplayMode(
    _params: GetDisplayPropsParams<R, CompoundSupplyTokenDataProps>,
  ): Promise<DisplayProps['balanceDisplayMode']> {
    return BalanceDisplayMode.UNDERLYING;
  }

  protected async getApy({ contract, appToken }: GetDataPropsParams<R, CompoundSupplyTokenDataProps>) {
    const [underlyingToken] = appToken.tokens;
    const supplyRate = await this.getSupplyRate(contract);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    return this.getDenormalizedRate({
      blocksPerDay,
      rate: supplyRate,
      decimals: underlyingToken.decimals,
    });
  }

  async getDataProps(opts: GetDataPropsParams<R, CompoundSupplyTokenDataProps>): Promise<CompoundSupplyTokenDataProps> {
    const { appToken } = opts;
    const apy = await this.getApy(opts);
    const liquidity = appToken.price * appToken.supply;
    return { apy, liquidity, exchangeable: this.isExchangeable };
  }
}
