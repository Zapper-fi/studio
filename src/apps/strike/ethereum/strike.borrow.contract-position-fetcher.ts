import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundBorrowContractPositionFetcher,
  GetMarketsParams,
} from '~apps/compound/common/compound.borrow.contract-position-fetcher';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import {
  GetDataPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { StrikeComptroller, StrikeContractFactory, StrikeSToken } from '../contracts';

export type StrikeBorrowTokenDataProps = {
  apy: number;
  liquidity: number;
  isActive: boolean;
  collateralFactor: number;
};

@PositionTemplate()
export class EthereumStrikeBorrowContractPositionFetcher extends CompoundBorrowContractPositionFetcher<
  StrikeSToken,
  StrikeComptroller
> {
  groupLabel = 'Lending';
  comptrollerAddress = '0xe2e17b2cbbf48211fa7eb8a875360e5e39ba2602';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StrikeContractFactory) protected readonly contractFactory: StrikeContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundCTokenContract(address: string) {
    return this.contractFactory.strikeSToken({ address, network: this.network });
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.strikeComptroller({ address, network: this.network });
  }

  async getMarkets({ contract }: GetMarketsParams<StrikeComptroller>) {
    return contract.getAllMarkets();
  }

  async getUnderlyingAddress({ contract }: GetTokenDefinitionsParams<StrikeSToken>) {
    return contract.underlying();
  }

  async getExchangeRate({ contract }: GetDataPropsParams<StrikeSToken>) {
    return contract.callStatic.exchangeRateCurrent();
  }

  async getBorrowRate({ contract }: GetDataPropsParams<StrikeSToken>) {
    return contract.borrowRatePerBlock();
  }

  async getCash({ contract }: GetDataPropsParams<StrikeSToken>) {
    return contract.getCash();
  }

  async getCTokenSupply({ contract }: GetDataPropsParams<StrikeSToken>) {
    return contract.totalSupply();
  }

  async getCTokenDecimals({ contract }: GetDataPropsParams<StrikeSToken>) {
    return contract.decimals();
  }

  async getBorrowBalance({ address, contract }: GetTokenBalancesParams<StrikeSToken>) {
    return contract.callStatic.borrowBalanceCurrent(address);
  }

  async getDataProps(
    params: GetDataPropsParams<StrikeSToken, StrikeBorrowTokenDataProps>,
  ): Promise<StrikeBorrowTokenDataProps> {
    const [underlyingToken] = params.contractPosition.tokens;

    const [decimals, supplyRaw, pricePerShare, apy, cashRaw] = await Promise.all([
      this.getCTokenDecimals(params),
      this.getCTokenSupply(params),
      this.getPricePerShare(params),
      this.getApy(params),
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
      liquidity: -borrowLiquidity,
      isActive: Boolean(borrowLiquidity > 0),
      apy,
      collateralFactor,
    };
  }
}
