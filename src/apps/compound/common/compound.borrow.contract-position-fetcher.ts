import { BigNumberish, Contract } from 'ethers';

import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { DisplayProps } from '~position/display.interface';
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
};

export abstract class CompoundBorrowContractPositionFetcher<
  R extends Contract,
  S extends Contract,
> extends ContractPositionTemplatePositionFetcher<R, CompoundBorrowTokenDataProps> {
  abstract comptrollerAddress: string;
  abstract getCompoundCTokenContract(address: string): R;
  abstract getCompoundComptrollerContract(address: string): S;

  abstract getMarkets(contract: S): Promise<string[]>;
  abstract getUnderlyingAddress(contract: R): Promise<string>;
  abstract getExchangeRate(contract: R): Promise<BigNumberish>;
  abstract getBorrowRate(contract: R): Promise<BigNumberish>;
  abstract getCash(contract: R): Promise<BigNumberish>;
  abstract getBorrowBalance(opts: { address: string; contract: R }): Promise<BigNumberish>;
  abstract getCTokenSupply(contract: R): Promise<BigNumberish>;
  abstract getCTokenDecimals(contract: R): Promise<number>;

  getContract(address: string): R {
    return this.getCompoundCTokenContract(address);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const comptroller = this.getCompoundComptrollerContract(this.comptrollerAddress);
    const addresses = await this.getMarkets(multicall.wrap(comptroller));
    return addresses.map(addr => ({ address: addr.toLowerCase() }));
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<R, DefaultContractPositionDefinition>): Promise<UnderlyingTokenDefinition[] | null> {
    const underlyingAddressRaw = await this.getUnderlyingAddress(contract).catch(err => {
      // if the underlying call failed, it's the compound-wrapped native token
      if (isMulticallUnderlyingError(err)) return ZERO_ADDRESS;
      throw err;
    });

    const underlyingAddress = underlyingAddressRaw.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
    return [{ address: underlyingAddress, metaType: MetaType.BORROWED }];
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

  getDenormalizedRate({
    blocksPerDay,
    rate,
  }: {
    rate: BigNumberish;
    blocksPerDay: number;
    decimals: number;
  }): number {
    return 100 * (Math.pow(1 + (blocksPerDay * Number(rate)) / Number(1e18), 365) - 1);
  }

  async getApy({ contract, contractPosition }: GetDataPropsParams<R, CompoundBorrowTokenDataProps>) {
    const [underlyingToken] = contractPosition.tokens;
    const borrowRate = await this.getBorrowRate(contract);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    return this.getDenormalizedRate({
      blocksPerDay,
      rate: borrowRate,
      decimals: underlyingToken.decimals,
    });
  }

  async getExchangeRateMantissa(opts: GetDataPropsParams<R, CompoundBorrowTokenDataProps>) {
    const { contractPosition } = opts;
    const [underlyingToken] = contractPosition.tokens;
    return underlyingToken.decimals + 10;
  }

  async getPricePerShare(opts: GetDataPropsParams<R, CompoundBorrowTokenDataProps>) {
    const { contract } = opts;
    const [rateRaw, mantissa] = await Promise.all([this.getExchangeRate(contract), this.getExchangeRateMantissa(opts)]);
    return Number(rateRaw) / 10 ** mantissa;
  }

  async getDataProps(opts: GetDataPropsParams<R, CompoundBorrowTokenDataProps>): Promise<CompoundBorrowTokenDataProps> {
    const { contractPosition, contract } = opts;
    const [underlyingToken] = contractPosition.tokens;

    const [decimals, supplyRaw, pricePerShare, apy, cashRaw] = await Promise.all([
      this.getCTokenDecimals(contract),
      this.getCTokenSupply(contract),
      this.getPricePerShare(opts),
      this.getApy(opts),
      this.getCash(contract).catch(e => {
        if (isMulticallUnderlyingError(e)) return 0;
        throw e;
      }),
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
      apy,
    };
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<R, CompoundBorrowTokenDataProps>) {
    const balanceRaw = await this.getBorrowBalance({ contract, address });
    return [balanceRaw];
  }
}
