import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetDefinitionsParams,
  GetUnderlyingTokensParams,
  GetPricePerShareParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
} from '~position/template/app-token.template.types';

import { CurveContractFactory } from '../contracts';

export type CurvePoolTokenDataProps = {
  swapAddress: string;
  liquidity: number;
  reserves: number[];
  apy: number;
  volume: number;
  fee: number;
};

export type CurvePoolDefinition = {
  address: string;
  swapAddress: string;
};

export abstract class CurvePoolTokenFetcher<T extends Contract> extends AppTokenTemplatePositionFetcher<
  Erc20,
  CurvePoolTokenDataProps,
  CurvePoolDefinition
> {
  abstract registryAddress: string;

  abstract resolveRegistry(address: string): T;
  abstract resolvePoolCount(registryContract: T): Promise<BigNumberish>;
  abstract resolveSwapAddress(registryContract: T, index: number): Promise<string>;
  abstract resolveTokenAddress(registryContract: T, swapAddress: string): Promise<string>;
  abstract resolveCoinAddresses(registryContract: T, swapAddress: string): Promise<string[]>;
  abstract resolveReserves(registryContract: T, swapAddress: string): Promise<BigNumberish[]>;
  abstract resolveFees(registryContract: T, swapAddress: string): Promise<BigNumberish[]>;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CurveContractFactory) protected readonly contractFactory: CurveContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams) {
    const registry = this.resolveRegistry(this.registryAddress);
    const wrappedRegistry = multicall.wrap(registry);

    const poolCount = this.resolvePoolCount(wrappedRegistry);
    const poolRange = range(0, Number(poolCount));
    const poolDefinitions = await Promise.all(
      poolRange.map(async i => {
        const swapAddress = await this.resolveSwapAddress(wrappedRegistry, i);
        const tokenAddress = await this.resolveTokenAddress(wrappedRegistry, swapAddress);
        return { address: tokenAddress.toLowerCase(), swapAddress: swapAddress.toLowerCase() };
      }),
    );

    return poolDefinitions;
  }

  async getAddresses({ definitions }: GetAddressesParams<DefaultAppTokenDefinition>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({ multicall, definition }: GetUnderlyingTokensParams<Erc20, CurvePoolDefinition>) {
    const registry = this.resolveRegistry(this.registryAddress);
    const wrappedRegistry = multicall.wrap(registry);
    const coinsRaw = await this.resolveCoinAddresses(wrappedRegistry, definition.swapAddress);

    return coinsRaw
      .map(v => v.toLowerCase())
      .filter(v => v !== ZERO_ADDRESS)
      .map(v => (v === ETH_ADDR_ALIAS ? ZERO_ADDRESS : v));
  }

  async getPricePerShare({
    multicall,
    definition,
    appToken,
  }: GetPricePerShareParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const registry = this.resolveRegistry(this.registryAddress);
    const wrappedRegistry = multicall.wrap(registry);
    const reservesRaw = await this.resolveReserves(wrappedRegistry, definition.swapAddress);

    const reserves = reservesRaw
      .slice(0, appToken.tokens.length)
      .map((v, i) => Number(v) / 10 ** appToken.tokens[i].decimals);
    const pricePerShare = reserves.map(v => v / appToken.supply);

    return pricePerShare;
  }

  async getDataProps(params: GetDataPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const defaultDataProps = await super.getDataProps(params);

    const { multicall, definition } = params;
    const registry = this.resolveRegistry(this.registryAddress);
    const wrappedRegistry = multicall.wrap(registry);

    const fees = await this.resolveFees(wrappedRegistry, definition.swapAddress);
    const fee = Number(fees[0]) / 10 ** 10;
    return { ...defaultDataProps, fee, volume: 0, apy: 0 };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<Erc20, CurvePoolTokenDataProps, CurvePoolDefinition>) {
    const reservesUSD = appToken.tokens.map((t, i) => appToken.dataProps.reserves[i] * t.price);
    const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
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
