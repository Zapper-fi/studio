import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildStringDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import {
  CompoundBorrowContractPositionFetcher,
  CompoundBorrowTokenDataProps,
  GetMarketsParams,
} from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { StatsItem } from '~position/display.interface';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SonneComptroller, SonneContractFactory, SonneSoToken } from '../contracts';

export type SonneBorrowTokenDataProps = CompoundBorrowTokenDataProps & {
  collateralFactor: number;
};

@PositionTemplate()
export class OptimismSonneBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  SonneSoToken,
  SonneComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x60cf091cd3f50420d50fd7f707414d0df4751c58';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SonneContractFactory) protected readonly contractFactory: SonneContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.sonneSoToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.sonneComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<SonneComptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<SonneSoToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getBorrowRate({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.borrowRatePerBlock();
  }

  async getCash({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.decimals();
  }

  async getBorrowBalance({ address, contract }: GetTokenBalancesParams<SonneSoToken>) {
    return contract.callStatic.borrowBalanceCurrent(address);
  }

  async getDataProps(
    params: GetDataPropsParams<SonneSoToken, SonneBorrowTokenDataProps>,
  ): Promise<SonneBorrowTokenDataProps> {
    const defaultDataProps = await super.getDataProps(params);

    const [underlyingToken] = params.contractPosition.tokens;

    const [decimals, supplyRaw, pricePerShare, cashRaw] = await Promise.all([
      this.getCTokenDecimals(params),
      this.getCTokenSupply(params),
      this.getPricePerShare(params),
      this.getCash(params).catch(e => {
        if (isMulticallUnderlyingError(e)) return 0;
        throw e;
      }),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = pricePerShare * underlyingToken.price;
    const underlyingLiquidity = price * supply;

    const comptrollerContract = this.getCompoundComptrollerContract(this.comptrollerAddress);
    const collateralFactorRaw = await params.multicall
      .wrap(comptrollerContract)
      .markets(params.contractPosition.address);
    const collateralFactor = Number(collateralFactorRaw.collateralFactorMantissa) / 10 ** 18;

    // The "cash" needs to be converted back into a proper number format.
    // We use the underlying token as the basis for the conversion.
    const cashSupply = Number(cashRaw) / 10 ** underlyingToken.decimals;
    // Liquidity is the total supply of "cash" multiplied by the price of an underlying token
    const borrowedPositionliquidity = cashSupply * underlyingToken.price;

    const borrowLiquidity =
      borrowedPositionliquidity > underlyingLiquidity ? 0 : underlyingLiquidity - borrowedPositionliquidity;

    return {
      ...defaultDataProps,
      liquidity: -borrowLiquidity,
      isActive: Boolean(borrowLiquidity > 0),
      collateralFactor,
    };
  }

  async getStatsItems({
    contractPosition,
  }: GetDisplayPropsParams<SonneSoToken, SonneBorrowTokenDataProps>): Promise<StatsItem[] | undefined> {
    const { apy, liquidity, exchangeRate, symbol, collateralFactor } = contractPosition.dataProps;
    const exchangeRateFormatted = `${(1 / exchangeRate).toFixed(3)} ${symbol} = 1 ${contractPosition.tokens[0].symbol}`;

    return [
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Exchange Rate', value: buildStringDisplayItem(exchangeRateFormatted) },
      { label: 'Collateral Factor', value: buildPercentageDisplayItem(collateralFactor) },
    ];
  }
}
