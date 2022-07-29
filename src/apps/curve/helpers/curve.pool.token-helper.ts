import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, partition } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurvePoolDefinition, CurvePoolType } from './curve.pool.registry';

export type CurvePoolTokenDataProps = {
  poolType: CurvePoolType;
  swapAddress: string;
  gaugeAddress: string;
  liquidity: number;
  apy: number;
  volume: number;
  fee: number;
};

export type CurvePoolTokenHelperParams<T> = {
  network: Network;
  appId: string;
  groupId: string;
  poolDefinitions: CurvePoolDefinition[];
  minLiquidity?: number;
  dependencies?: AppGroupsDefinition[];
  baseCurveTokens?: AppTokenPosition[];
  resolvePoolContract: (opts: { network: Network; definition: CurvePoolDefinition }) => T;
  resolvePoolReserves: (opts: {
    definition: CurvePoolDefinition;
    multicall: IMulticallWrapper;
    poolContract: T;
  }) => Promise<BigNumberish[]>;
  resolvePoolTokenPrice: (opts: {
    multicall: IMulticallWrapper;
    poolContract: T;
    tokens: Token[];
    reserves: number[];
    supply: number;
    poolType: CurvePoolType;
  }) => Promise<number>;
  resolvePoolFee: (opts: { multicall: IMulticallWrapper; poolContract: T }) => Promise<BigNumberish>;
};

@Injectable()
export class CurvePoolTokenHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  private async _getTokens<T>({
    network,
    appId,
    groupId,
    poolDefinitions,
    minLiquidity = 0,
    dependencies = [],
    baseCurveTokens = [],
    resolvePoolContract,
    resolvePoolReserves,
    resolvePoolTokenPrice,
    resolvePoolFee,
  }: CurvePoolTokenHelperParams<T>) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);

    const curvePoolTokens = await Promise.all(
      poolDefinitions.map(async definition => {
        const { swapAddress, tokenAddress, coinAddresses } = definition;
        const poolContract = resolvePoolContract({ network, definition });
        const tokenContract = this.appToolkit.globalContracts.erc20({ network, address: definition.tokenAddress });
        const reservesRaw = await resolvePoolReserves({ multicall, poolContract, definition });

        const maybeTokens = coinAddresses.map(tokenAddress => {
          const baseToken = baseTokens.find(price => price.address === tokenAddress);
          const appToken = appTokens.find(p => p.address === tokenAddress);
          const curveToken = baseCurveTokens.find(p => p.address === tokenAddress);
          return curveToken ?? appToken ?? baseToken;
        });

        // If any underlying token is missing, do not display this pool
        const tokens = compact(maybeTokens);
        const isMissingUnderlyingTokens = tokens.length !== maybeTokens.length;
        if (isMissingUnderlyingTokens) return null;

        const symbol = await multicall.wrap(tokenContract).symbol();
        const supplyRaw = await multicall.wrap(tokenContract).totalSupply();
        const feeRaw = await resolvePoolFee({ multicall, poolContract }).catch(() => '0'); // @TODO

        const decimals = 18;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const fee = Number(feeRaw) / 10 ** 10;
        if (supply === 0) return null;

        const poolType = definition.poolType ?? CurvePoolType.STABLE;
        const volume = definition.volume ?? 0;
        const apy = definition.apy ?? 0;

        const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** tokens[i].decimals);
        const underlying = tokens.flatMap(v => (v.type === ContractType.APP_TOKEN && v.tokens.length ? v.tokens : v));
        const price = await resolvePoolTokenPrice({ multicall, poolContract, reserves, supply, tokens, poolType });

        const pricePerShare = reserves.map(r => r / supply);
        const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
        const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
        const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);
        const ratio = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');
        const gaugeAddress = definition.gaugeAddress ?? ZERO_ADDRESS;

        // Display Properties
        const label = tokens.map(v => getLabelFromToken(v)).join(' / ');
        const secondaryLabel = ratio;
        const images = underlying.map(t => getImagesFromToken(t)).flat();

        const curvePoolToken: AppTokenPosition<CurvePoolTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          address: tokenAddress,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            poolType,
            swapAddress,
            gaugeAddress,
            liquidity,
            volume,
            apy,
            fee,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
              },
              {
                label: 'Supply',
                value: buildNumberDisplayItem(supply),
              },
              {
                label: 'Volume',
                value: buildDollarDisplayItem(volume),
              },
              {
                label: 'APY',
                value: buildPercentageDisplayItem(apy),
              },
              {
                label: 'Fee',
                value: buildPercentageDisplayItem(fee),
              },
              {
                label: 'Ratio',
                value: ratio,
              },
            ],
          },
        };

        return curvePoolToken;
      }),
    );

    return compact(curvePoolTokens).filter(v => !!v && v.price > 0 && v.dataProps.liquidity >= minLiquidity);
  }

  async getTokens<T>(params: CurvePoolTokenHelperParams<T>) {
    const [basePoolDefinitions, metaPoolDefinitions] = partition(params.poolDefinitions, v => !v.isMetaPool);
    const baseCurveTokens = await this._getTokens({ ...params, poolDefinitions: basePoolDefinitions });
    const metaCurveTokens = await this._getTokens({ ...params, poolDefinitions: metaPoolDefinitions, baseCurveTokens });
    return [...baseCurveTokens, ...metaCurveTokens];
  }
}
