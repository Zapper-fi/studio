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
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { StatsItem } from '~position/display.interface';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SonneViemContractFactory } from '../contracts';
import { SonneComptroller, SonneSoToken } from '../contracts/viem';

export type SonneBorrowTokenDataProps = CompoundBorrowTokenDataProps & {
  collateralFactor: number;
};

@PositionTemplate()
export class BaseSonneBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  SonneSoToken,
  SonneComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0x1db2466d9f5e10d7090e7152b68d62703a2245f0';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SonneViemContractFactory) protected readonly contractFactory: SonneViemContractFactory,
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
    return contract.read.getAllMarkets().then(v => [...v]);
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<SonneSoToken>) {
    return contract.read.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.simulate.exchangeRateCurrent().then(v => v.result);
  }

  async getBorrowRate({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.read.borrowRatePerBlock();
  }

  async getCash({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.read.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.read.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<SonneSoToken>) {
    return contract.read.decimals();
  }

  async getBorrowBalance({ address, contract }: GetTokenBalancesParams<SonneSoToken>) {
    return contract.simulate.borrowBalanceCurrent([address]).then(v => v.result);
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
        if (isViemMulticallUnderlyingError(e)) return 0;
        throw e;
      }),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = pricePerShare * underlyingToken.price;
    const underlyingLiquidity = price * supply;

    const comptrollerContract = this.getCompoundComptrollerContract(this.comptrollerAddress);
    const collateralFactorRaw = await params.multicall
      .wrap(comptrollerContract)
      .read.markets([params.contractPosition.address]);
    const collateralFactor = Number(collateralFactorRaw[1]) / 10 ** 18;

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
