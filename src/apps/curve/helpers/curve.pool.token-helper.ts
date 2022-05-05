import { Inject, Injectable } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { compact, isUndefined } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  buildDollarDisplayItem,
  buildNumberDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

import { CurveToken } from '../contracts';
import { CURVE_DEFINITION } from '../curve.definition';
import { CurvePoolDefinition } from '../curve.types';

export type CurvePoolTokenDataProps = {
  swapAddress: string;
  liquidity: number;
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
  resolvePoolDefinitions: (opts: { network: Network; multicall: Multicall }) => Promise<CurvePoolDefinition[]>;
  resolvePoolVolume?: (opts: {
    poolContract: T;
    tokens: Token[];
    definition: CurvePoolDefinition;
    price: number;
  }) => Promise<number>;
  resolvePoolContract: (opts: { network: Network; definition: CurvePoolDefinition }) => T;
  resolvePoolTokenContract: (opts: { network: Network; definition: CurvePoolDefinition }) => V;
  resolvePoolCoinAddresses: (opts: { multicall: Multicall; poolContract: T }) => Promise<string[]>;
  resolvePoolReserves: (opts: { multicall: Multicall; poolContract: T }) => Promise<string[]>;
  resolvePoolFee: (opts: { multicall: Multicall; poolContract: T }) => Promise<BigNumberish>;
  resolvePoolTokenSymbol: (opts: { multicall: Multicall; poolTokenContract: V }) => Promise<string>;
  resolvePoolTokenSupply: (opts: { multicall: Multicall; poolTokenContract: V }) => Promise<BigNumber>;
  resolvePoolTokenPrice: (opts: {
    multicall: Multicall;
    poolContract: T;
    tokens: Token[];
    reserves: number[];
    supply: number;
  }) => Promise<number>;
};

const isMetaPool = (token: Token) =>
  token.type === ContractType.APP_TOKEN &&
  token.appId === CURVE_DEFINITION.id &&
  token.groupId === CURVE_DEFINITION.groups.pool.id;

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
    resolvePoolVolume,
    resolvePoolContract,
    resolvePoolTokenContract,
    resolvePoolCoinAddresses,
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
        const { tokenAddress, swapAddress } = definition;
        const poolContract = resolvePoolContract({ network, definition });
        const poolTokenContract = resolvePoolTokenContract({ network, definition });
        const rawTokenAddresses = await resolvePoolCoinAddresses({ multicall, poolContract });
        const tokenAddresses = rawTokenAddresses.map(v => (v === ETH_ADDR_ALIAS ? ZERO_ADDRESS : v.toLowerCase()));
        const reservesRaw = await resolvePoolReserves({ multicall, poolContract });

        const tokens = tokenAddresses.map(tokenAddress => {
          const baseToken = baseTokens.find(price => price.address === tokenAddress);
          const appToken = appTokens.find(p => p.address === tokenAddress);
          const curveToken = baseCurveTokens.find(p => p.address === tokenAddress);
          return curveToken ?? appToken ?? baseToken;
        });

        // If any underlying token is missing, do not display this pool
        const isMissingUnderlyingTokens = tokens.some(isUndefined);
        if (isMissingUnderlyingTokens) return null;

        const sanitizedTokens = tokens as NonNullable<typeof tokens[number]>[];

        const [symbol, supplyRaw, feeRaw] = await Promise.all([
          resolvePoolTokenSymbol({ multicall, poolTokenContract }),
          resolvePoolTokenSupply({ multicall, poolTokenContract }),
          resolvePoolFee({ multicall, poolContract }),
        ]);

        const decimals = 18;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const fee = Number(feeRaw) / 10 ** 10;
        if (supply === 0) return null;

        const reserves = reservesRaw.map((r, i) => Number(r) / 10 ** sanitizedTokens[i].decimals);
        const underlyingTokens = sanitizedTokens.flatMap(v => (v.type === ContractType.BASE_TOKEN ? v : v.tokens));
        const price = await resolvePoolTokenPrice({
          tokens: sanitizedTokens,
          reserves,
          poolContract,
          multicall,
          supply,
        });
        const volume = resolvePoolVolume
          ? await resolvePoolVolume({ definition, poolContract, tokens: sanitizedTokens, price })
          : 0;

        const pricePerShare = reserves.map(r => r / supply);
        const reservesUSD = sanitizedTokens.map((t, i) => reserves[i] * t.price);
        const liquidity = reservesUSD.reduce((total, r) => total + r, 0);
        const reservePercentages = reservesUSD.map(reserveUSD => reserveUSD / liquidity);

        // Display Properties
        const underlyingLabels = sanitizedTokens.map(v => (isMetaPool(v) ? getLabelFromToken(v) : v.symbol)); // Flatten metapool label
        const label = definition.label ?? underlyingLabels.join(' / ');
        const secondaryLabel = reservePercentages.map(p => `${Math.floor(p * 100)}%`).join(' / ');
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
          tokens: sanitizedTokens,

          dataProps: {
            swapAddress,
            liquidity,
            volume,
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
                label: 'Fee',
                value: buildPercentageDisplayItem(fee),
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
