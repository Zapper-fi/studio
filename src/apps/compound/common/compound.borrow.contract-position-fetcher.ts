import { BigNumberish, Contract } from 'ethers';

import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { DisplayProps, StatsItem } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

export type CompoundBorrowTokenDataProps = {
  apy: number;
  liquidity: number;
  isActive: boolean;
  exchangeRate: number;
  symbol: string;
};

export type GetMarketsParams<S> = GetDefinitionsParams & {
  contract: S;
};

export abstract class CompoundBorrowContractPositionFetcher<
  R extends Contract,
  S extends Contract,
> extends ContractPositionTemplatePositionFetcher<R, CompoundBorrowTokenDataProps> {
  abstract comptrollerAddress: string;
  abstract getCompoundCTokenContract(address: string): R;
  abstract getCompoundComptrollerContract(address: string): S;

  abstract getMarkets(params: GetMarketsParams<S>): Promise<string[]>;
  abstract getUnderlyingAddress(params: GetTokenDefinitionsParams<R>): Promise<string>;
  abstract getExchangeRate(params: GetDataPropsParams<R, CompoundBorrowTokenDataProps>): Promise<BigNumberish>;
  abstract getBorrowRate(params: GetDataPropsParams<R, CompoundBorrowTokenDataProps>): Promise<BigNumberish>;
  abstract getCash(params: GetDataPropsParams<R, CompoundBorrowTokenDataProps>): Promise<BigNumberish>;
  abstract getCTokenSupply(params: GetDataPropsParams<R, CompoundBorrowTokenDataProps>): Promise<BigNumberish>;
  abstract getCTokenDecimals(params: GetDataPropsParams<R, CompoundBorrowTokenDataProps>): Promise<number>;
  abstract getBorrowBalance(params: GetTokenBalancesParams<R, CompoundBorrowTokenDataProps>): Promise<BigNumberish>;

  getContract(address: string): R {
    return this.getCompoundCTokenContract(address);
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const comptroller = this.getCompoundComptrollerContract(this.comptrollerAddress);
    const addresses = await this.getMarkets({ ...params, contract: comptroller });
    return addresses.map(addr => ({ address: addr.toLowerCase() }));
  }

  async getTokenDefinitions(params: GetTokenDefinitionsParams<R>): Promise<UnderlyingTokenDefinition[] | null> {
    const underlyingAddressRaw = await this.getUnderlyingAddress(params).catch(err => {
      // if the underlying call failed, it's the compound-wrapped native token
      if (isMulticallUnderlyingError(err)) return ZERO_ADDRESS;
      throw err;
    });

    const underlyingAddress = underlyingAddressRaw.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);

    return [
      {
        metaType: MetaType.BORROWED,
        address: underlyingAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<R, CompoundBorrowTokenDataProps>): Promise<DisplayProps['label']> {
    const [underlyingToken] = contractPosition.tokens;
    return getLabelFromToken(underlyingToken);
  }

  async getSecondaryLabel({
    contractPosition,
  }: GetDisplayPropsParams<R, CompoundBorrowTokenDataProps>): Promise<DisplayProps['secondaryLabel']> {
    const [underlyingToken] = contractPosition.tokens;
    return buildDollarDisplayItem(underlyingToken.price);
  }

  getDenormalizedRate({ blocksPerDay, rate }: { rate: BigNumberish; blocksPerDay: number; decimals: number }): number {
    return 100 * (Math.pow(1 + (blocksPerDay * Number(rate)) / Number(1e18), 365) - 1);
  }

  async getApy(params: GetDataPropsParams<R, CompoundBorrowTokenDataProps>) {
    const [underlyingToken] = params.contractPosition.tokens;
    const borrowRate = await this.getBorrowRate(params);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    return this.getDenormalizedRate({
      blocksPerDay,
      rate: borrowRate,
      decimals: underlyingToken.decimals,
    });
  }

  async getExchangeRateMantissa({ contractPosition }: GetDataPropsParams<R, CompoundBorrowTokenDataProps>) {
    const [underlyingToken] = contractPosition.tokens;
    return underlyingToken.decimals + 10;
  }

  async getPricePerShare(params: GetDataPropsParams<R, CompoundBorrowTokenDataProps>) {
    const [rateRaw, mantissa] = await Promise.all([this.getExchangeRate(params), this.getExchangeRateMantissa(params)]);
    return Number(rateRaw) / 10 ** mantissa;
  }

  async getDataProps(
    params: GetDataPropsParams<R, CompoundBorrowTokenDataProps>,
  ): Promise<CompoundBorrowTokenDataProps> {
    const [underlyingToken] = params.contractPosition.tokens;

    const multicall = params.multicall;
    const erc20 = this.appToolkit.globalContracts.erc20({
      address: params.contractPosition.address,
      network: this.network,
    });
    const symbol = await multicall.wrap(erc20).symbol();

    const [decimals, supplyRaw, pricePerShare, apy, cashRaw, exchangeRate] = await Promise.all([
      this.getCTokenDecimals(params),
      this.getCTokenSupply(params),
      this.getPricePerShare(params),
      this.getApy(params),
      this.getCash(params).catch(e => {
        if (isMulticallUnderlyingError(e)) return 0;
        throw e;
      }),
      this.getPricePerShare(params),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = pricePerShare * underlyingToken.price;
    const underlyingLiquidity = price * supply;

    // The "cash" needs to be converted back into a proper number format.
    // We use the underlying token as the basis for the conversion.
    const cashSupply = Number(cashRaw) / 10 ** underlyingToken.decimals;
    // Liquidity is the total supply of "cash" multiplied by the price of an underlying token
    const borrowedPositionliquidity = cashSupply * underlyingToken.price;

    const borrowLiquidity =
      borrowedPositionliquidity > underlyingLiquidity ? 0 : underlyingLiquidity - borrowedPositionliquidity;

    return {
      liquidity: -borrowLiquidity,
      isActive: Boolean(borrowLiquidity > 0),
      exchangeRate,
      symbol,
      apy,
    };
  }

  async getStatsItems({
    contractPosition,
  }: GetDisplayPropsParams<R, CompoundBorrowTokenDataProps>): Promise<StatsItem[] | undefined> {
    const { apy, liquidity, exchangeRate, symbol } = contractPosition.dataProps;
    const exchangeRateFormatted = `${(1 / exchangeRate).toFixed(3)} ${symbol} = 1 ${contractPosition.tokens[0].symbol}`;

    return [
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Exchange Rate', value: buildStringDisplayItem(exchangeRateFormatted) },
    ];
  }

  async getTokenBalancesPerPosition(params: GetTokenBalancesParams<R, CompoundBorrowTokenDataProps>) {
    const balanceRaw = await this.getBorrowBalance(params);
    return [balanceRaw];
  }
}
