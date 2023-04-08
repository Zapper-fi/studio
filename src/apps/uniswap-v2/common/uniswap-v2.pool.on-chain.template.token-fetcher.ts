import { BigNumberish, Contract } from 'ethers';
import { compact, range } from 'lodash';

import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

export type UniswapV2TokenDataProps = DefaultAppTokenDataProps & {
  fee: number;
  volume: number;
};

export abstract class UniswapV2PoolOnChainTemplateTokenFetcher<
  T extends Contract,
  V extends Contract,
> extends AppTokenTemplatePositionFetcher<T, UniswapV2TokenDataProps> {
  abstract factoryAddress: string;

  abstract getPoolTokenContract(address: string): T;
  abstract getPoolFactoryContract(address: string): V;

  abstract getPoolsLength(contract: V): Promise<BigNumberish>;
  abstract getPoolAddress(contract: V, index: number): Promise<string>;
  abstract getPoolToken0(contract: T): Promise<string>;
  abstract getPoolToken1(contract: T): Promise<string>;
  abstract getPoolReserves(contract: T): Promise<BigNumberish[]>;

  fee = 0.3;

  getContract(address: string): T {
    return this.getPoolTokenContract(address);
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>) {
    const factoryContract = multicall.wrap(this.getPoolFactoryContract(this.factoryAddress));
    const poolsLength = await this.getPoolsLength(factoryContract);

    const poolAddresses = await Promise.all(
      range(0, Number(poolsLength)).map(async poolIndex => {
        const poolAddressRaw = await this.getPoolAddress(factoryContract, poolIndex).catch(e => {
          if (isMulticallUnderlyingError(e)) return null;
          throw e;
        });

        if (!poolAddressRaw) return null;
        return poolAddressRaw.toLowerCase();
      }),
    );

    return compact(poolAddresses);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<T>) {
    return [
      { address: await this.getPoolToken0(contract), network: this.network },
      { address: await this.getPoolToken1(contract), network: this.network },
    ];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<T, UniswapV2TokenDataProps>) {
    const [token0, token1] = appToken.tokens;
    const [reserve0, reserve1] = await this.getPoolReserves(contract);
    const reserves = [Number(reserve0) / 10 ** token0.decimals, Number(reserve1) / 10 ** token1.decimals];
    const pricePerShare = reserves.map(r => r / appToken.supply);
    return pricePerShare;
  }

  async getDataProps(params: GetDataPropsParams<T, UniswapV2TokenDataProps>) {
    const defaultDataProps = await super.getDataProps(params);
    const fee = this.fee;
    const volume = 0;

    return { ...defaultDataProps, fee, volume };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<T, UniswapV2TokenDataProps>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<T, UniswapV2TokenDataProps>) {
    const { liquidity, reserves } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<T, UniswapV2TokenDataProps>) {
    const { fee, reserves, liquidity, volume, apy } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    const ratioDisplay = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
    const reservesDisplay = reserves.map(v => (v < 0.01 ? '<0.01' : v.toFixed(2))).join(' / ');

    return [
      { label: 'Fee', value: buildPercentageDisplayItem(fee) },
      { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
      { label: 'Reserves', value: reservesDisplay },
      { label: 'Ratio', value: ratioDisplay },
      { label: 'Volume', value: buildDollarDisplayItem(volume) },
      { label: 'APY', value: buildPercentageDisplayItem(apy) },
    ];
  }
}
