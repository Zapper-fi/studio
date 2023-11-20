import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { Abi, BaseError, ContractFunctionRevertedError, GetContractReturnType, PublicClient } from 'viem';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ViemMulticallDataLoader } from '~multicall';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { BalanceDisplayMode } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

export type MidasMarketTokenDataProps = DefaultAppTokenDataProps & {
  marketName: string;
  comptroller: string;
};

export type MidasMarketTokenDefinition = {
  address: string;
  marketName: string;
  comptroller: string;
};

export type FusePoolStruct = {
  name: string;
  creator: string;
  comptroller: string;
  blockPosted: BigNumberish;
  timestampPosted: BigNumberish;
};

export abstract class MidasMarketTokenFetcher<
  PD extends Abi,
  CT extends Abi,
  PL extends Abi,
> extends AppTokenTemplatePositionFetcher<CT, MidasMarketTokenDataProps, MidasMarketTokenDefinition> {
  abstract poolDirectoryAddress: string;
  abstract poolLensAddress: string;

  abstract getPoolDirectoryContract(address: string): GetContractReturnType<PD, PublicClient>;
  abstract getCTokenContract(address: string): GetContractReturnType<CT, PublicClient>;
  abstract getPoolLensContract(address: string): GetContractReturnType<PL, PublicClient>;

  abstract getPools(contract: GetContractReturnType<PD, PublicClient>): Promise<[BigNumberish[], FusePoolStruct[]]>;
  abstract getPool(contract: GetContractReturnType<PD, PublicClient>, poolId: BigNumberish): Promise<FusePoolStruct>;
  abstract getMarketTokenAddresses(
    contract: GetContractReturnType<PL, PublicClient>,
    poolAddress: string,
  ): Promise<string[]>;
  abstract getUnderlyingTokenAddress(contract: GetContractReturnType<CT, PublicClient>): Promise<string>;
  abstract getExchangeRateCurrent(contract: GetContractReturnType<CT, PublicClient>): Promise<BigNumberish>;
  abstract getSupplyRateRaw(contract: GetContractReturnType<CT, PublicClient>): Promise<BigNumberish>;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.getCTokenContract(address);
  }

  async getDefinitions() {
    const poolDirectory = this.getPoolDirectoryContract(this.poolDirectoryAddress);
    const poolLens = this.getPoolLensContract(this.poolLensAddress);
    const [poolIndexes, pools] = await this.getPools(poolDirectory);

    if (!pools.length || !poolIndexes.length) {
      return [];
    }

    const definitions = await Promise.all(
      poolIndexes.map(async poolId => {
        const { comptroller, name } = await this.getPool(poolDirectory, poolId);
        const marketAddresses = await this.getMarketTokenAddresses(poolLens, comptroller).catch(e => {
          if (e instanceof BaseError) {
            const err = e.walk((e: Error) => e instanceof ContractFunctionRevertedError);

            if (err) {
              const reason = (err as ContractFunctionRevertedError).reason;
              if (reason === 'Not implemented') return [];
            }
          }

          throw e;
        });

        return marketAddresses.map(marketAddress => ({
          address: marketAddress.toLowerCase(),
          comptroller,
          marketName: name,
        }));
      }),
    );

    return definitions.flat();
  }

  async getAddresses({
    definitions,
  }: {
    multicall: ViemMulticallDataLoader;
    definitions: MidasMarketTokenDefinition[];
  }) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<CT>) {
    return [{ address: await this.getUnderlyingTokenAddress(contract), network: this.network }];
  }

  async getPricePerShare({
    contract,
    appToken,
  }: GetPricePerShareParams<CT, MidasMarketTokenDataProps, MidasMarketTokenDefinition>) {
    const supplyRateRaw = await this.getExchangeRateCurrent(contract).catch(err => {
      if (isViemMulticallUnderlyingError(err)) return 0;
      throw err;
    });

    const mantissa = 18 + appToken.tokens[0]!.decimals - appToken.decimals;
    const supplyRate = Number(supplyRateRaw) / 10 ** mantissa;
    return [supplyRate];
  }

  async getLiquidity({ appToken }: GetDataPropsParams<CT>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<CT>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ contract }: GetDataPropsParams<CT>) {
    const supplyRateRaw = await this.getSupplyRateRaw(contract);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    const supplyRate = Number(supplyRateRaw) / 10 ** 18;
    const apy = (Math.pow(1 + blocksPerDay * supplyRate, 365) - 1) * 100;

    return apy;
  }

  async getDataProps(params: GetDataPropsParams<CT, MidasMarketTokenDataProps, MidasMarketTokenDefinition>) {
    const defaultDataProps = await super.getDataProps(params);
    const { marketName, comptroller } = params.definition;

    return { ...defaultDataProps, marketName, comptroller };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<CT, MidasMarketTokenDataProps, MidasMarketTokenDefinition>) {
    return getLabelFromToken(appToken.tokens[0]);
  }

  async getLabelDetailed({
    appToken,
  }: GetDisplayPropsParams<CT, MidasMarketTokenDataProps, MidasMarketTokenDefinition>) {
    return appToken.symbol;
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<CT, MidasMarketTokenDataProps, MidasMarketTokenDefinition>) {
    return buildDollarDisplayItem(appToken.tokens[0].price);
  }

  async getBalanceDisplayMode() {
    return BalanceDisplayMode.UNDERLYING;
  }
}
