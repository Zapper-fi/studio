import { Inject } from '@nestjs/common';
import DataLoader from 'dataloader';
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

import { CurveContractFactory } from '../contracts';

import { CurveVolumeDataLoader } from './curve.volume.data-loader';

export type CurvePoolTokenDataProps = DefaultAppTokenDataProps & {
  swapAddress: string;
  volume: number;
  fee: number;
};

export type CurvePoolDefinition = {
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
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export type ResolveCoinAddressesParams<T extends Contract> = {
  contract: T;
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export type ResolveReservesParams<T extends Contract> = {
  contract: T;
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export type ResolveFeesParams<T extends Contract> = {
  contract: T;
  swapAddress: string;
  multicall: IMulticallWrapper;
};

export abstract class CurvePoolDynamicTokenFetcher<T extends Contract> extends AppTokenTemplatePositionFetcher<
  Erc20,
  CurvePoolTokenDataProps,
  CurvePoolDefinition
> {
  volumeDataLoader: DataLoader<string, number>;

  abstract registryAddress: string;
  blacklistedSwapAddresses: string[] = [];

  abstract resolveRegistry(address: string): T;
  abstract resolvePoolCount(params: ResolvePoolCountParams<T>): Promise<BigNumberish>;
  abstract resolveSwapAddress(params: ResolveSwapAddressParams<T>): Promise<string>;
  abstract resolveTokenAddress(params: ResolveTokenAddressParams<T>): Promise<string>;
  abstract resolveCoinAddresses(params: ResolveCoinAddressesParams<T>): Promise<string[]>;
  abstract resolveReserves(params: ResolveReservesParams<T>): Promise<BigNumberish[]>;
  abstract resolveFees(params: ResolveFeesParams<T>): Promise<BigNumberish[]>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    this.volumeDataLoader = this.curveVolumeDataLoader.getLoader({ network: this.network });

    const contract = multicall.wrap(this.resolveRegistry(this.registryAddress));
    const poolCount = await this.resolvePoolCount({ contract, multicall });
    const poolRange = range(0, Number(poolCount));
    const poolDefinitions = await Promise.all(
      poolRange.map(async poolIndex => {
        const swapAddress = await this.resolveSwapAddress({ contract, poolIndex, multicall });
        const tokenAddress = await this.resolveTokenAddress({ contract, swapAddress, multicall });
        return { address: tokenAddress.toLowerCase(), swapAddress: swapAddress.toLowerCase() };
      }),
    );

    return compact(poolDefinitions).filter(v => !this.blacklistedSwapAddresses.includes(v.address));
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    multicall,
    definition,
  }: GetUnderlyingTokensParams<Erc20, CurvePoolDefinition>) {
    const contract = multicall.wrap(this.resolveRegistry(this.registryAddress));
    const swapAddress = definition.swapAddress;
    const coinsRaw = await this.resolveCoinAddresses({ contract, swapAddress, multicall });

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
  }: GetPricePerShareParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    if (appToken.supply === 0) return appToken.tokens.map(() => 0);

    const contract = multicall.wrap(this.resolveRegistry(this.registryAddress));
    const swapAddress = definition.swapAddress;
    const reservesRaw = await this.resolveReserves({ contract, swapAddress, multicall });

    const reserves = reservesRaw
      .slice(0, appToken.tokens.length)
      .map((v, i) => Number(v) / 10 ** appToken.tokens[i].decimals);
    const pricePerShare = reserves.map(v => v / appToken.supply);

    return pricePerShare;
  }

  async getDataProps(params: GetDataPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const defaultDataProps = await super.getDataProps(params);

    const { multicall, definition } = params;
    const contract = multicall.wrap(this.resolveRegistry(this.registryAddress));
    const swapAddress = definition.swapAddress;

    const fees = await this.resolveFees({ contract, swapAddress, multicall });
    const fee = Number(fees[0]) / 10 ** 8;

    const volume = await this.volumeDataLoader.load(definition.swapAddress);
    const feeVolume = fee * volume;
    const apy = defaultDataProps.liquidity > 0 ? (feeVolume / defaultDataProps.liquidity) * 365 : 0;

    return { ...defaultDataProps, fee, volume, apy, swapAddress };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const reservesUSD = appToken.tokens.map((t, i) => appToken.dataProps.reserves[i] * t.price);
    const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
    if (liquidity === 0) return appToken.tokens.map(() => '0%').join(' / ');

    const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);
    const ratio = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');

    return ratio;
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const { liquidity, volume, apy, fee } = appToken.dataProps;

    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Volume', value: buildDollarDisplayItem(volume) },
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Fee', value: buildPercentageDisplayItem(fee) },
    ];
  }
}
