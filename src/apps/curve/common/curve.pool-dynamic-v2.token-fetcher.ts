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

import { CurveContractFactory, CurveTricryptoPool } from '../contracts';

import { CurveVolumeDataLoader } from './curve.volume.data-loader';

export type CurvePoolTokenDataProps = DefaultAppTokenDataProps & {
  volume: number;
  fee: number;
};

export type ResolvePoolCountParams<T extends Contract> = {
  contract: T;
  multicall: IMulticallWrapper;
};

export type ResolveTokenAddressParams<T extends Contract> = {
  contract: T;
  poolIndex: number;
  multicall: IMulticallWrapper;
};

export type ResolveCoinAddressesParams<T extends Contract> = {
  contract: T;
  tokenAddress: string;
  multicall: IMulticallWrapper;
};

export type ResolveReservesParams<T extends Contract> = {
  contract: T;
  tokenAddress: string;
  multicall: IMulticallWrapper;
};

export abstract class CurvePoolDynamicV2TokenFetcher<T extends Contract> extends AppTokenTemplatePositionFetcher<
  CurveTricryptoPool,
  CurvePoolTokenDataProps
> {
  volumeDataLoader: DataLoader<string, number>;

  abstract factoryAddress: string;
  blacklistedTokenAddresses: string[] = [];

  abstract resolveFactory(address: string): T;
  abstract resolvePoolCount(params: ResolvePoolCountParams<T>): Promise<BigNumberish>;
  abstract resolveTokenAddress(params: ResolveTokenAddressParams<T>): Promise<string>;
  abstract resolveCoinAddresses(params: ResolveCoinAddressesParams<T>): Promise<string[]>;
  abstract resolveReserves(params: ResolveReservesParams<T>): Promise<BigNumberish[]>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
    @Inject(CurveVolumeDataLoader) protected readonly curveVolumeDataLoader: CurveVolumeDataLoader,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CurveTricryptoPool {
    return this.contractFactory.curveTricryptoPool({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    this.volumeDataLoader = this.curveVolumeDataLoader.getLoader({ network: this.network });

    const contract = multicall.wrap(this.resolveFactory(this.factoryAddress));
    const poolCount = await this.resolvePoolCount({ contract, multicall });
    const poolRange = range(0, Number(poolCount));
    const poolDefinitions = await Promise.all(
      poolRange.map(async poolIndex => {
        const tokenAddress = await this.resolveTokenAddress({ contract, multicall, poolIndex });
        return { address: tokenAddress.toLowerCase() };
      }),
    );

    return compact(poolDefinitions).filter(v => !this.blacklistedTokenAddresses.includes(v.address));
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ multicall, definition }: GetUnderlyingTokensParams<CurveTricryptoPool>) {
    const contract = multicall.wrap(this.resolveFactory(this.factoryAddress));
    const tokenAddress = definition.address;
    const coinsRaw = await this.resolveCoinAddresses({ contract, tokenAddress, multicall });

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
  }: GetPricePerShareParams<CurveTricryptoPool, CurvePoolTokenDataProps>) {
    if (appToken.supply === 0) return appToken.tokens.map(() => 0);

    const contract = multicall.wrap(this.resolveFactory(this.factoryAddress));
    const tokenAddress = definition.address;
    const reservesRaw = await this.resolveReserves({ contract, tokenAddress, multicall });

    const reserves = reservesRaw
      .slice(0, appToken.tokens.length)
      .map((v, i) => Number(v) / 10 ** appToken.tokens[i].decimals);
    const pricePerShare = reserves.map(v => v / appToken.supply);

    return pricePerShare;
  }

  async getDataProps(params: GetDataPropsParams<CurveTricryptoPool, CurvePoolTokenDataProps>) {
    const defaultDataProps = await super.getDataProps(params);

    const { contract, definition } = params;

    const fees = await contract.fee();
    const fee = Number(fees) / 10 ** 8;

    const volume = await this.volumeDataLoader.load(definition.address);
    const feeVolume = fee * volume;
    const apy = defaultDataProps.liquidity > 0 ? (feeVolume / defaultDataProps.liquidity) * 365 : 0;

    return { ...defaultDataProps, fee, volume, apy };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<CurveTricryptoPool, CurvePoolTokenDataProps>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<CurveTricryptoPool, CurvePoolTokenDataProps>) {
    const reservesUSD = appToken.tokens.map((t, i) => appToken.dataProps.reserves[i] * t.price);
    const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
    if (liquidity === 0) return appToken.tokens.map(() => '0%').join(' / ');

    const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);
    const ratio = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');

    return ratio;
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<CurveTricryptoPool, CurvePoolTokenDataProps>) {
    const { liquidity, volume, apy, fee } = appToken.dataProps;

    return [
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Volume', value: buildDollarDisplayItem(volume) },
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
      { label: 'Fee', value: buildPercentageDisplayItem(fee) },
    ];
  }
}
