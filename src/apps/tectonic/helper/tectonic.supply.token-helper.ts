import { Inject, Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
  buildNumberDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { BalanceDisplayMode } from '~position/display.interface';
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { TectonicCore, TectonicContractFactory, TectonicTToken } from '../contracts';

import { tectonicConst } from './constants';

const getAnnualApy = (ratePerBlock: BigNumber): number => {
  // The current supply rate as an unsigned integer, scaled by 1e18.
  const borrowRate = ratePerBlock;
  const dailyYieldRate =
    borrowRate
      .mul(BigNumber.from(tectonicConst.BLOCKS_PER_DAY))
      .mul(10000000)
      .div(BigNumber.from(tectonicConst.ETH_MANTISSA))
      .toNumber() /
      10000000 +
    1;
  const annualYieldRate = (Math.pow(dailyYieldRate, tectonicConst.DAYS_PER_YEAR) - 1) * 10000;

  // updated to percentage number with 4 digits precision.
  // e.g. 20.05% will be returned as 0.2005
  return Math.round(annualYieldRate) / 10000;
};

export type TectonicSupplyTokenDataProps = {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  marketName?: string;
  tectonicCoreAddress: string;
};

type TectonicSupplyTokenHelperParams<T = TectonicCore, V = TectonicTToken> = {
  network: Network;
  appId: string;
  groupId: string;
  dependencies?: AppGroupsDefinition[];
  allTokens?: (BaseToken | AppTokenPosition)[];
  tectonicCoreAddress: string;
  marketName?: string;
  getTectonicCoreContract: (opts: { address: string; network: Network }) => T;
  getTokenContract: (opts: { address: string; network: Network }) => V;
  getAllMarkets: (opts: { contract: T; multicall: IMulticallWrapper }) => string[] | Promise<string[]>;
  getTokenSymbol: (opts: { contract: V }) => Promise<string>;
  getTokenDecimals: (opts: { contract: V }) => Promise<number>;
  getExchangeRate: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<BigNumber>;
  getSupplyRate: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<BigNumber>;
  getBorrowRate: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<BigNumber>;
  getTotalSupply: (opts: { contract: V }) => Promise<BigNumber>;
  getUnderlyingAddress: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<string>;
  getExchangeRateMantissa: (opts: { tokenDecimals: number; underlyingTokenDecimals: number }) => number;
  getDisplayLabel?: (opts: { contract: V; multicall: IMulticallWrapper; underlyingToken: Token }) => Promise<string>;
};

@Injectable()
export class TectonicSupplyTokenHelper {
  constructor(
    @Inject(TectonicContractFactory) private readonly contractFactory: TectonicContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getTokens<T = TectonicCore, V = TectonicTToken>({
    tectonicCoreAddress,
    marketName,
    network,
    appId,
    groupId,
    dependencies = [],
    allTokens = [],
    getTectonicCoreContract,
    getTokenContract,
    getAllMarkets,
    getExchangeRate,
    getTokenSymbol,
    getTokenDecimals,
    getSupplyRate,
    getBorrowRate,
    getTotalSupply,
    getUnderlyingAddress,
    getExchangeRateMantissa,
    getDisplayLabel,
  }: TectonicSupplyTokenHelperParams<T, V>) {
    const multicall = this.appToolkit.getMulticall(network);

    if (!allTokens.length) {
      const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
      const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
      allTokens.push(...appTokens, ...baseTokens);
    }

    const tectonicCoreContract = getTectonicCoreContract({ network, address: tectonicCoreAddress });
    const marketTokenAddressesRaw = await getAllMarkets({ contract: tectonicCoreContract, multicall });

    const tokens = await Promise.all(
      marketTokenAddressesRaw.map(async marketTokenAddressRaw => {
        const address = marketTokenAddressRaw.toLowerCase();
        const contract = getTokenContract({ address, network });

        const underlyingAddress = await getUnderlyingAddress({ contract, multicall })
          .then(t => t.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS))
          .catch(() => ZERO_ADDRESS);

        const underlyingToken = allTokens.find(v => v.address === underlyingAddress);
        if (!underlyingToken) return null;

        const [symbol, decimals, supplyRaw, rateRaw, supplyRateRaw, borrowRateRaw] = await Promise.all([
          getTokenSymbol({ contract }),
          getTokenDecimals({ contract }),
          getTotalSupply({ contract }),
          getExchangeRate({ contract, multicall }),
          getSupplyRate({ contract, multicall }).catch(() => BigNumber.from(0)),
          getBorrowRate({ contract, multicall }).catch(() => BigNumber.from(0)),
        ]);

        // Data Props
        const type = ContractType.APP_TOKEN;
        const underlyingTokenDecimals = underlyingToken.decimals;
        const underlyingSupplyRaw = supplyRaw.mul(rateRaw).div(BigNumber.from(tectonicConst.ETH_MANTISSA));
        const underlyingSupply = Number(underlyingSupplyRaw) / 10 ** underlyingTokenDecimals;

        const mantissa = getExchangeRateMantissa({ tokenDecimals: decimals, underlyingTokenDecimals });
        const pricePerShare = Number(rateRaw) / 10 ** mantissa;
        const price = pricePerShare * underlyingToken.price;
        const liquidity = underlyingSupply * underlyingToken.price;

        const tokens = [underlyingToken];
        const supplyApy = getAnnualApy(supplyRateRaw);
        const borrowApy = getAnnualApy(borrowRateRaw);

        // Display Props
        const label = getDisplayLabel
          ? await getDisplayLabel({ contract, multicall, underlyingToken })
          : underlyingToken.symbol;
        const secondaryLabel = buildDollarDisplayItem(underlyingToken.price);
        const tertiaryLabel = `${(supplyApy * 100).toFixed(3)}% APY`;
        const images = [getTokenImg(underlyingToken.address, network)];
        const balanceDisplayMode = BalanceDisplayMode.UNDERLYING;
        const statsItems = [
          { label: 'APY', value: buildPercentageDisplayItem(supplyApy * 100) },
          { label: 'Liquidity', value: buildNumberDisplayItem(liquidity) },
        ];

        const token: AppTokenPosition<TectonicSupplyTokenDataProps> = {
          type,
          address,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply: underlyingSupply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            marketName,
            supplyApy,
            borrowApy,
            liquidity,
            tectonicCoreAddress,
          },

          displayProps: {
            label,
            secondaryLabel,
            tertiaryLabel,
            images,
            statsItems,
            balanceDisplayMode,
          },
        };

        return token;
      }),
    );

    return _.compact(tokens);
  }
}
