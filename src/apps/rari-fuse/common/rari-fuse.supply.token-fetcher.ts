import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { Abi, GetContractReturnType, PublicClient } from 'viem';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { BalanceDisplayMode } from '~position/display.interface';
import { RawTokenBalance } from '~position/position-balance.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetDefinitionsParams,
  DefaultAppTokenDataProps,
  GetAddressesParams,
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
  T extends Abi,
  V extends Abi,
  R extends Abi,
  S extends Abi,
> extends AppTokenTemplatePositionFetcher<R, RariFuseSupplyTokenDataProps, RariFuseSupplyTokenDefinition> {
  abstract poolDirectoryAddress: string;
  abstract lensAddress: string;

  abstract getPoolDirectoryContract(address: string): GetContractReturnType<T, PublicClient>;
  abstract getComptrollerContract(address: string): GetContractReturnType<V, PublicClient>;
  abstract getTokenContract(address: string): GetContractReturnType<R, PublicClient>;
  abstract getLensContract(address: string): GetContractReturnType<S, PublicClient>;

  abstract getPools(contract: GetContractReturnType<T, PublicClient>): Promise<{ name: string; comptroller: string }[]>;
  abstract getMarketTokenAddresses(contract: GetContractReturnType<V, PublicClient>): Promise<string[]>;
  abstract getUnderlyingTokenAddress(contract: GetContractReturnType<R, PublicClient>): Promise<string>;
  abstract getExchangeRateCurrent(contract: GetContractReturnType<R, PublicClient>): Promise<BigNumberish>;
  abstract getSupplyRateRaw(contract: GetContractReturnType<R, PublicClient>): Promise<BigNumberish>;
  abstract getPoolsBySupplier(
    address: string,
    contract: GetContractReturnType<S, PublicClient>,
  ): Promise<[BigNumberish[], { comptroller: string }[]]>;

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

  async getAddresses({ definitions }: GetAddressesParams<RariFuseSupplyTokenDefinition>) {
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
      if (isViemMulticallUnderlyingError(err)) return 0;
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

  async getRawBalances(address: string): Promise<RawTokenBalance[]> {
    const lens = this.getLensContract(this.lensAddress);
    const [, comptrollers] = await this.getPoolsBySupplier(address, lens);
    const participatedComptrollers = comptrollers.map(t => t.comptroller.toLowerCase());

    const multicall = this.appToolkit.getViemMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<RariFuseSupplyTokenDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    return Promise.all(
      appTokens
        .filter(v => participatedComptrollers.includes(v.dataProps.comptroller))
        .map(async appToken => {
          const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
          return { key: this.appToolkit.getPositionKey(appToken), balance: balanceRaw.toString() };
        }),
    );
  }
}
