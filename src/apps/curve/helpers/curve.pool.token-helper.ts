import { Inject, Injectable } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveToken } from '../contracts';

import { CurvePoolDefinition } from './registry/curve.on-chain.registry';

export type CurvePoolTokenDataProps = {
  gaugeAddress: string;
  swapAddress: string;
  liquidity: number;
  apy: number;
  volume: number;
  fee: number;
};

type CurvePoolTokenHelperParams<T = CurveToken, V = Erc20> = {
  network: Network;
  appId: string;
  groupId: string;
  statsUrl?: string;
  minLiquidity?: number;
  appTokenDependencies?: AppGroupsDefinition[];
  baseCurveTokens?: AppTokenPosition[];
  resolvePoolDefinitions: (opts: { network: Network; multicall: IMulticallWrapper }) => Promise<CurvePoolDefinition[]>;
  resolvePoolContract: (opts: { network: Network; definition: CurvePoolDefinition }) => T;
  resolvePoolTokenContract: (opts: { network: Network; definition: CurvePoolDefinition }) => V;
  resolvePoolReserves: (opts: { multicall: IMulticallWrapper; poolContract: T }) => Promise<string[]>;
  resolvePoolFee: (opts: { multicall: IMulticallWrapper; poolContract: T }) => Promise<BigNumberish>;
  resolvePoolTokenSymbol: (opts: { multicall: IMulticallWrapper; poolTokenContract: V }) => Promise<string>;
  resolvePoolTokenSupply: (opts: { multicall: IMulticallWrapper; poolTokenContract: V }) => Promise<BigNumber>;
  resolvePoolTokenPrice: (opts: {
    multicall: IMulticallWrapper;
    poolContract: T;
    tokens: Token[];
    reserves: number[];
    supply: number;
  }) => Promise<number>;
};

@Injectable()
export class CurvePoolTokenHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getTokens<T = CurveToken, V = Erc20>({
    network,
    appId,
    groupId,
    minLiquidity = 0,
    appTokenDependencies = [],
    baseCurveTokens = [],
    resolvePoolDefinitions,
    resolvePoolContract,
    resolvePoolTokenContract,
    resolvePoolFee,
    resolvePoolReserves,
    resolvePoolTokenSymbol,
    resolvePoolTokenSupply,
    resolvePoolTokenPrice,
  }: CurvePoolTokenHelperParams<T, V>) {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...appTokenDependencies);
    const poolDefinitions = await resolvePoolDefinitions({ network, multicall });

    const curvePoolTokens = await Promise.all(
      poolDefinitions.map(async definition => {
        const { gaugeAddress, tokenAddress, swapAddress } = definition;
        const poolContract = resolvePoolContract({ network, definition });
        const poolTokenContract = resolvePoolTokenContract({ network, definition });
        const reservesRaw = await resolvePoolReserves({ multicall, poolContract });

        const maybeTokens = definition.coinAddresses.map(tokenAddress => {
          const baseToken = baseTokens.find(price => price.address === tokenAddress);
          const appToken = appTokens.find(p => p.address === tokenAddress);
          const curveToken = baseCurveTokens.find(p => p.address === tokenAddress);
          return curveToken ?? appToken ?? baseToken;
        });

        // If any underlying token is missing, do not display this pool
        const tokens = compact(maybeTokens);
        const isMissingUnderlyingTokens = tokens.length !== maybeTokens.length;
        if (isMissingUnderlyingTokens) return null;

        const [symbol, supplyRaw, feeRaw] = await Promise.all([
          resolvePoolTokenSymbol({ multicall, poolTokenContract }),
          resolvePoolTokenSupply({ multicall, poolTokenContract }),
          resolvePoolFee({ multicall, poolContract }),
        ]);

        const decimals = 18;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const fee = Number(feeRaw) / 10 ** 10;
        if (supply === 0) return null;

        const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** tokens[i].decimals);
        const underlyingTokens = tokens.flatMap(v => (v.type === ContractType.BASE_TOKEN ? v : v.tokens));
        const price = await resolvePoolTokenPrice({
          tokens,
          reserves,
          poolContract,
          multicall,
          supply,
        });
        const volume = definition.volume;
        const apy = definition.apy;

        const pricePerShare = reserves.map(r => r / supply);
        const reservesUSD = tokens.map((t, i) => reserves[i] * t.price);
        const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
        const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);
        const ratio = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');

        // Display Properties
        const label = tokens.map(v => getLabelFromToken(v)).join(' / ');
        const secondaryLabel = ratio;
        const images = underlyingTokens.map(t => getImagesFromToken(t)).flat();

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
            gaugeAddress,
            swapAddress,
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
}
