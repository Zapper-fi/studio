import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import { IMulticallWrapper } from '~multicall';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetDefinitionsParams,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { PancakeswapContractFactory } from '../contracts';

export type PancakeswapPoolTokenDataProps = DefaultAppTokenDataProps & {
  swapAddress: string;
  fee: number;
};

export type PancakeswapPoolDefinition = {
  address: string;
  swapAddress: string;
};

export type ResolvePoolCountParams<T extends Contract> = {
  contract: T;
  multicall: IMulticallWrapper;
};

export type ResolveSwapAddressParams<T extends Contract> = {
  contract: T;
  poolIndex: number;
  multicall: IMulticallWrapper;
};

export type ResolveTokenAddressParams<T extends Contract> = {
  contract: T;
  multicall: IMulticallWrapper;
};

export type ResolveCoinAddressesParams<T extends Contract> = {
  contract: T;
  multicall: IMulticallWrapper;
};

export type ResolveReservesParams<T extends Contract> = {
  contract: T;
  multicall: IMulticallWrapper;
};

export type ResolveFeesParams<T extends Contract> = {
  contract: T;
  multicall: IMulticallWrapper;
};

export abstract class PancakeswapPoolDynamicTokenFetcher<
  R extends Contract,
  T extends Contract,
> extends AppTokenTemplatePositionFetcher<Erc20, PancakeswapPoolTokenDataProps, PancakeswapPoolDefinition> {
  abstract registryAddress: string;

  abstract resolveRegistry(address: string): R;
  abstract resolveStablePool(address: string): T;
  abstract resolvePoolCount(params: ResolvePoolCountParams<R>): Promise<BigNumberish>;
  abstract resolveSwapAddress(params: ResolveSwapAddressParams<R>): Promise<string>;
  abstract resolveTokenAddress(params: ResolveTokenAddressParams<T>): Promise<string>;
  abstract resolveCoinAddresses(params: ResolveCoinAddressesParams<T>): Promise<string[]>;
  abstract resolveReserves(params: ResolveReservesParams<T>): Promise<BigNumberish[]>;
  abstract resolveFees(params: ResolveFeesParams<T>): Promise<BigNumberish>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PancakeswapContractFactory) protected readonly contractFactory: PancakeswapContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const registryContract = multicall.wrap(this.resolveRegistry(this.registryAddress));
    const poolCount = await this.resolvePoolCount({ contract: registryContract, multicall });
    const poolRange = range(0, Number(poolCount));
    const poolDefinitions = await Promise.all(
      poolRange.map(async poolIndex => {
        const swapAddress = await this.resolveSwapAddress({ contract: registryContract, poolIndex, multicall });
        const stablePoolContract = multicall.wrap(this.resolveStablePool(swapAddress));
        const tokenAddress = await this.resolveTokenAddress({ contract: stablePoolContract, multicall });
        return { address: tokenAddress.toLowerCase(), swapAddress: swapAddress.toLowerCase() };
      }),
    );

    return compact(poolDefinitions);
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<Erc20, PancakeswapPoolDefinition>) {
    const contract = multicall.wrap(this.resolveStablePool(definition.swapAddress));
    const coinsRaw = await this.resolveCoinAddresses({ contract, multicall });

    const underlyingTokenAddresses = coinsRaw
      .map(v => v.toLowerCase())
      .filter(v => v !== ZERO_ADDRESS)
      .map(v => (v === ETH_ADDR_ALIAS ? ZERO_ADDRESS : v));

    return underlyingTokenAddresses.map(address => ({ address, network: this.network }));
  }

  async getPricePerShare({
    multicall,
    definition,
    appToken,
  }: GetPricePerShareParams<Erc20, PancakeswapPoolTokenDataProps, PancakeswapPoolDefinition>) {
    if (appToken.supply === 0) return appToken.tokens.map(() => 0);

    const contract = multicall.wrap(this.resolveStablePool(definition.swapAddress));
    const reservesRaw = await this.resolveReserves({ contract, multicall });

    const reserves = reservesRaw
      .slice(0, appToken.tokens.length)
      .map((v, i) => Number(v) / 10 ** appToken.tokens[i].decimals);
    const pricePerShare = reserves.map(v => v / appToken.supply);

    return pricePerShare;
  }

  async getDataProps(params: GetDataPropsParams<Erc20, PancakeswapPoolTokenDataProps, PancakeswapPoolDefinition>) {
    const defaultDataProps = await super.getDataProps(params);

    const { multicall, definition } = params;
    const contract = multicall.wrap(this.resolveStablePool(params.definition.swapAddress));
    const swapAddress = definition.swapAddress;

    const fees = await this.resolveFees({ contract, multicall });
    const fee = Number(fees) / 10 ** 8;

    const apy = 0;

    return { ...defaultDataProps, fee, apy, swapAddress };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Erc20, PancakeswapPoolTokenDataProps, PancakeswapPoolDefinition>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<Erc20, PancakeswapPoolTokenDataProps, PancakeswapPoolDefinition>) {
    const reservesUSD = appToken.tokens.map((t, i) => appToken.dataProps.reserves[i] * t.price);
    const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
    if (liquidity === 0) return appToken.tokens.map(() => '0%').join(' / ');

    const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);
    const ratio = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');

    return ratio;
  }

  async getStatsItems({
    appToken,
  }: GetDisplayPropsParams<Erc20, PancakeswapPoolTokenDataProps, PancakeswapPoolDefinition>) {
    const { liquidity, apy, fee } = appToken.dataProps;

    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Fee', value: buildPercentageDisplayItem(fee) },
    ];
  }
}
