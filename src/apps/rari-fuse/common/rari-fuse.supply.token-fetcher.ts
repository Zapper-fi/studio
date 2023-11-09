import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, Contract } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { isMulticallUnderlyingError } from '~multicall/impl/multicall.ethers';
import { BalanceDisplayMode } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetDefinitionsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

export type RariFuseSupplyTokenDataProps = DefaultAppTokenDataProps & {
  marketName: string;
  comptroller: string;
};

export type RariFuseSupplyTokenDefinition = {
  address: string;
  marketName: string;
  comptroller: string;
};

export abstract class RariFuseSupplyTokenFetcher<
  T extends Contract,
  V extends Contract,
  R extends Contract,
  S extends Contract,
> extends AppTokenTemplatePositionFetcher<R, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition> {
  abstract poolDirectoryAddress: string;
  abstract lensAddress: string;

  abstract getPoolDirectoryContract(address: string): T;
  abstract getComptrollerContract(address: string): V;
  abstract getTokenContract(address: string): R;
  abstract getLensContract(address: string): S;

  abstract getPools(contract: T): Promise<{ name: string; comptroller: string }[]>;
  abstract getMarketTokenAddresses(contract: V): Promise<string[]>;
  abstract getUnderlyingTokenAddress(contract: R): Promise<string>;
  abstract getExchangeRateCurrent(contract: R): Promise<BigNumberish>;
  abstract getSupplyRateRaw(contract: R): Promise<BigNumberish>;
  abstract getPoolsBySupplier(address: string, contract: S): Promise<[BigNumber[], { comptroller: string }[]]>;

  minLiquidity = 0;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.getTokenContract(address);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const poolDirectory = this.getPoolDirectoryContract(this.poolDirectoryAddress);
    const pools = await this.getPools(poolDirectory);

    const definitions = await Promise.all(
      pools.map(async pool => {
        const comptroller = multicall.wrap(this.getComptrollerContract(pool.comptroller));
        const marketAddresses = await this.getMarketTokenAddresses(comptroller);

        return marketAddresses.map(marketAddress => ({
          address: marketAddress.toLowerCase(),
          comptroller: pool.comptroller.toLowerCase(),
          marketName: pool.name,
        }));
      }),
    );

    return definitions.flat();
  }

  async getAddresses({ definitions }: { multicall: IMulticallWrapper; definitions: RariFuseSupplyTokenDefinition[] }) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<R>) {
    return [{ address: await this.getUnderlyingTokenAddress(contract), network: this.network }];
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<R, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    const supplyRateRaw = await this.getExchangeRateCurrent(contract).catch(err => {
      if (isMulticallUnderlyingError(err)) return 0;
      throw err;
    });

    const mantissa = 18 + appToken.tokens[0]!.decimals - appToken.decimals;
    const supplyRate = Number(supplyRateRaw) / 10 ** mantissa;
    return [supplyRate];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<R>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<R>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ contract }: GetDataPropsParams<R>) {
    const supplyRateRaw = await this.getSupplyRateRaw(contract);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    const supplyRate = Number(supplyRateRaw) / 10 ** 18;
    const apy = (Math.pow(1 + blocksPerDay * supplyRate, 365) - 1) * 100;
    return apy;
  }

  async getDataProps(params: GetDataPropsParams<R, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const { marketName, comptroller } = params.definition;
    return { ...defaultDataProps, marketName, comptroller };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<R, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<R, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    return appToken.symbol;
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<R, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition>) {
    return buildDollarDisplayItem(appToken.tokens[0].price);
  }

  async getBalanceDisplayMode() {
    return BalanceDisplayMode.UNDERLYING;
  }
}
