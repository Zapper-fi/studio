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

import { CompoundComptroller, CompoundCToken } from '../contracts';

export type CompoundSupplyTokenDataProps = ExchangeableAppTokenDataProps & {
  apy: number;
  liquidity: number;
};

export abstract class CompoundSupplyTokenFetcher extends AppTokenTemplatePositionFetcher<CompoundCToken> {
  protected isExchangeable = false;

  abstract comptrollerAddress: string;
  abstract getCompoundCTokenContract(address: string): CompoundCToken;
  abstract getCompoundComptrollerContract(address: string): CompoundComptroller;

  getContract(address: string): CompoundCToken {
    return this.getCompoundCTokenContract(address);
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const comptroller = multicall.wrap(this.getCompoundComptrollerContract(this.comptrollerAddress));
    return comptroller.getAllMarkets();
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<CompoundCToken>) {
    const underlyingAddressRaw = await contract.underlying().catch(err => {
      // if the underlying call failed, it's the compound-wrapped native token
      if (isMulticallUnderlyingError(err)) return ZERO_ADDRESS;
      throw err;
    });

    return underlyingAddressRaw.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<CompoundCToken, CompoundSupplyTokenDataProps>) {
    const [underlyingToken] = appToken.tokens;
    const rateRaw = await contract.exchangeRateCurrent();
    const mantissa = underlyingToken.decimals + 10;

    return Number(rateRaw) / 10 ** mantissa;
  }

  async getLabel({
    appToken,
  }: GetDisplayPropsParams<CompoundCToken, CompoundSupplyTokenDataProps>): Promise<DisplayProps['label']> {
    const [underlyingToken] = appToken.tokens;
    return underlyingToken.symbol;
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<CompoundCToken, CompoundSupplyTokenDataProps>): Promise<DisplayProps['labelDetailed']> {
    return appToken.symbol;
  }

  async getBalanceDisplayMode(
    _params: GetDisplayPropsParams<CompoundCToken, CompoundSupplyTokenDataProps>,
  ): Promise<DisplayProps['balanceDisplayMode']> {
    return BalanceDisplayMode.UNDERLYING;
  }

  protected async getApy({ contract }: GetDataPropsParams<CompoundCToken, CompoundSupplyTokenDataProps>) {
    const supplyRate = await contract.supplyRatePerBlock().catch(() => 0);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    return 100 * (Math.pow(1 + (blocksPerDay * Number(supplyRate)) / Number(1e18), 365) - 1);
  }

  async getDataProps(
    opts: GetDataPropsParams<CompoundCToken, CompoundSupplyTokenDataProps>,
  ): Promise<CompoundSupplyTokenDataProps> {
    const { appToken } = opts;
    const apy = await this.getApy(opts);
    const liquidity = appToken.price * appToken.supply;
    return { apy, liquidity, exchangeable: this.isExchangeable };
  }
}
