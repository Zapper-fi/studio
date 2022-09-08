import { Inject } from '@nestjs/common';
import { compact, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { StatsItem } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { UniswapPair, UniswapV2ContractFactory } from '../contracts';

export type UniswapV2TokenDataProps = {
  liquidity: number;
  reserves: number[];
  fee: number;
  apy: number;
  volume: number;
};

export abstract class UniswapV2PoolOnChainTemplateTokenFetcher extends AppTokenTemplatePositionFetcher<
  UniswapPair,
  UniswapV2TokenDataProps
> {
  abstract factoryAddress: string;

  fee = 0.3;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(UniswapV2ContractFactory) protected readonly contractFactory: UniswapV2ContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): UniswapPair {
    return this.contractFactory.uniswapPair({ network: this.network, address });
  }

  async getAddresses({ multicall }: GetAddressesParams<DefaultAppTokenDefinition>) {
    const factoryContract = multicall.wrap(
      this.contractFactory.uniswapFactory({
        address: this.factoryAddress,
        network: this.network,
      }),
    );

    const poolsLength = await factoryContract.allPairsLength();

    const poolAddresses = await Promise.all(
      range(0, Number(poolsLength)).map(async poolIndex => {
        const poolAddressRaw = await factoryContract.allPairs(poolIndex);
        const poolAddress = poolAddressRaw.toLowerCase();
        return poolAddress;
      }),
    );

    return compact(poolAddresses);
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<UniswapPair>) {
    return Promise.all([contract.token0(), contract.token1()]);
  }

  async getPricePerShare({
    appToken,
    contract,
  }: GetPricePerShareParams<UniswapPair, UniswapV2TokenDataProps, DefaultAppTokenDefinition>) {
    const [token0, token1] = appToken.tokens;
    const [reserve0, reserve1] = await contract.getReserves();
    const reserves = [Number(reserve0) / 10 ** token0.decimals, Number(reserve1) / 10 ** token1.decimals];
    const pricePerShare = reserves.map(r => r / appToken.supply);
    return pricePerShare;
  }

  async getDataProps({ appToken }: GetDataPropsParams<UniswapPair, UniswapV2TokenDataProps>) {
    const reserves = (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
    const liquidity = appToken.price * appToken.supply;
    const fee = this.fee;
    const volume = 0;
    const apy = 0;

    return { liquidity, reserves, apy, fee, volume };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<UniswapPair, UniswapV2TokenDataProps>): Promise<string> {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }

  async getSecondaryLabel({
    appToken,
  }: GetDisplayPropsParams<UniswapPair, UniswapV2TokenDataProps, DefaultAppTokenDefinition>) {
    const { liquidity, reserves } = appToken.dataProps;
    const reservePercentages = appToken.tokens.map((t, i) => reserves[i] * (t.price / liquidity));
    return reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
  }

  async getStatsItems({
    appToken,
  }: GetDisplayPropsParams<UniswapPair, UniswapV2TokenDataProps, DefaultAppTokenDefinition>): Promise<
    StatsItem[] | undefined
  > {
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
