import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { pick, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { IMulticallWrapper } from '~multicall';
import { AppTokenPosition } from '~position/position.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { NotionalFinanceV3ViemContractFactory } from '../contracts';
import { NotionalFCash } from '../contracts/viem';

export type NotionalFCashTokenDefinition = {
  address: string;
  underlyingTokenAddress: string;
  currencyId: number;
  tokenId: string;
  maturity: number;
};

export type NotionalFCashTokenDataProps = DefaultAppTokenDataProps & {
  currencyId: number;
  tokenId: string;
  maturity: number;
  positionKey: string;
};

const NOTIONAL_CONSTANT = 10 ** 7;
const SECONDS_IN_YEAR = 31104000; // 360 days

@PositionTemplate()
export class ArbitrumNotionalFinanceV3FCashTokenFetcher extends AppTokenTemplatePositionFetcher<
  NotionalFCash,
  NotionalFCashTokenDataProps,
  NotionalFCashTokenDefinition
> {
  groupLabel = 'fCash';

  notionalViewContractAddress = '0x1344a36a1b56144c3bc62e7757377d288fde0369';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(NotionalFinanceV3ViemContractFactory)
    protected readonly contractFactory: NotionalFinanceV3ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.notionalFCash({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<NotionalFCashTokenDefinition[]> {
    const notionalViewContract = this.contractFactory.notionalView({
      address: this.notionalViewContractAddress,
      network: this.network,
    });

    const currencyCount = await multicall.wrap(notionalViewContract).getMaxCurrencyId();
    const currencyRange = range(1, currencyCount + 1);
    const definitions = await Promise.all(
      currencyRange.map(async currencyId => {
        const currency = await multicall.wrap(notionalViewContract).getCurrency(currencyId);
        const underlyingTokenAddress = currency.underlyingToken.tokenAddress.toLowerCase();
        const activeMarkets = await multicall.wrap(notionalViewContract).getActiveMarkets(currencyId);

        const markets = await Promise.all(
          activeMarkets.map(async activeMarket => {
            const maturity = Number(activeMarket.maturity);
            const tokenId = await multicall
              .wrap(notionalViewContract)
              .encodeToId(currencyId, maturity, 0)
              .then(v => v.toString());

            return {
              address: this.notionalViewContractAddress,
              currencyId,
              underlyingTokenAddress,
              maturity,
              tokenId,
            };
          }),
        );

        return markets;
      }),
    );

    return definitions.flat();
  }

  async getAddresses({ definitions }: GetAddressesParams<NotionalFCashTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getSymbol({ appToken }: GetTokenPropsParams<NotionalFCash>) {
    return `f${appToken.tokens[0].symbol}`;
  }

  async getSupply() {
    return 0;
  }

  async getDecimals({ appToken }: GetTokenPropsParams<NotionalFCash, NotionalFCashTokenDataProps>) {
    return appToken.tokens[0].decimals;
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<NotionalFCash, NotionalFCashTokenDefinition>) {
    return [{ address: definition.underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({
    definition,
    multicall,
  }: GetPricePerShareParams<NotionalFCash, NotionalFCashTokenDataProps, NotionalFCashTokenDefinition>) {
    const notionalViewContract = this.contractFactory.notionalView({
      address: this.notionalViewContractAddress,
      network: this.network,
    });

    const activeMarkets = await multicall.wrap(notionalViewContract).getActiveMarkets(definition.currencyId);
    const market = activeMarkets.find(v => Number(v.maturity) === definition.maturity);
    const apy = Number(market?.lastImpliedRate ?? 0) / NOTIONAL_CONSTANT;

    const dateNowEpoch = Date.now() / 1000;
    const timeToMaturity = (definition.maturity - dateNowEpoch) / SECONDS_IN_YEAR;
    const lastImpliedRate = apy / 100;
    const fCashPV = 1 / Math.exp(lastImpliedRate * timeToMaturity);

    return [fCashPV];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<NotionalFCash>) {
    return appToken.supply * appToken.price;
  }

  async getReserves() {
    return [0];
  }

  async getApy({
    definition,
    multicall,
  }: GetDataPropsParams<NotionalFCash, NotionalFCashTokenDataProps, NotionalFCashTokenDefinition>) {
    const notionalViewContract = this.contractFactory.notionalView({
      address: this.notionalViewContractAddress,
      network: this.network,
    });

    const activeMarkets = await multicall.wrap(notionalViewContract).getActiveMarkets(definition.currencyId);
    const market = activeMarkets.find(v => Number(v.maturity) === definition.maturity);
    return Number(market?.lastImpliedRate ?? 0) / NOTIONAL_CONSTANT;
  }

  async getDataProps(
    params: GetDataPropsParams<NotionalFCash, NotionalFCashTokenDataProps, NotionalFCashTokenDefinition>,
  ) {
    const defaultDataProps = await super.getDataProps(params);
    return {
      ...defaultDataProps,
      ...pick(params.definition, ['currencyId', 'tokenId', 'maturity']),
      positionKey: params.definition.tokenId,
    };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<NotionalFCash, NotionalFCashTokenDataProps>) {
    const maturityDate = new Date(Number(appToken.dataProps.maturity) * 1000);
    const year = maturityDate.getFullYear();
    const month = maturityDate.getMonth() + 1;
    const day = maturityDate.getDate();
    const displayMaturity = day + '/' + month + '/' + year;
    return `${appToken.symbol} - ${displayMaturity}`;
  }

  getBalancePerToken({
    address,
    appToken,
    multicall,
  }: {
    address: string;
    appToken: AppTokenPosition<NotionalFCashTokenDataProps>;
    multicall: IMulticallWrapper;
  }): Promise<BigNumberish> {
    return multicall.wrap(this.getContract(appToken.address)).balanceOf(address, appToken.dataProps.tokenId);
  }
}
