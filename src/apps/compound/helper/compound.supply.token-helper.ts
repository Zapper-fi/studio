import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { BalanceDisplayMode } from '~position/display.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { PriceSelector } from '~token/token-price-selector.interface';
import { Network } from '~types/network.interface';

import { CompoundComptroller, CompoundContractFactory, CompoundCToken } from '../contracts';

export type CompoundSupplyTokenDataProps = ExchangeableAppTokenDataProps & {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  marketName?: string;
  comptrollerAddress: string;
};

type CompoundSupplyTokenHelperParams<T = CompoundComptroller, V = CompoundCToken> = {
  network: Network;
  appId: string;
  groupId: string;
  dependencies?: AppGroupsDefinition[];
  baseTokenPriceSelector?: PriceSelector;
  comptrollerAddress: string;
  marketName?: string;
  getComptrollerContract: (opts: { address: string; network: Network }) => T;
  getTokenContract: (opts: { address: string; network: Network }) => V;
  getAllMarkets: (opts: { contract: T; multicall: IMulticallWrapper }) => string[] | Promise<string[]>;
  getExchangeRate: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<BigNumberish>;
  getSupplyRate: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<BigNumberish>;
  getBorrowRate: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<BigNumberish>;
  getSupplyRateLabel?: () => string;
  getUnderlyingAddress: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<string>;
  getExchangeRateMantissa: (opts: { tokenDecimals: number; underlyingTokenDecimals: number }) => number;
  getDisplayLabel?: (opts: { contract: V; multicall: IMulticallWrapper; underlyingToken: Token }) => Promise<string>;
  getDenormalizedRate?: (opts: { rate: BigNumberish; blocksPerDay: number; decimals: number }) => number;
  exchangeable?: boolean;
};

@Injectable()
export class CompoundSupplyTokenHelper {
  constructor(
    @Inject(CompoundContractFactory) private readonly contractFactory: CompoundContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getTokens<T = CompoundComptroller, V = CompoundCToken>({
    comptrollerAddress,
    marketName,
    network,
    appId,
    groupId,
    exchangeable = false,
    dependencies = [],
    baseTokenPriceSelector,
    getComptrollerContract,
    getTokenContract,
    getAllMarkets,
    getExchangeRate,
    getSupplyRate,
    getBorrowRate,
    getSupplyRateLabel = () => 'APY',
    getUnderlyingAddress,
    getExchangeRateMantissa,
    getDisplayLabel,
    getDenormalizedRate = ({ blocksPerDay, rate }) =>
      Math.pow(1 + (blocksPerDay * Number(rate)) / Number(1e18), 365) - 1,
  }: CompoundSupplyTokenHelperParams<T, V>) {
    const multicall = this.appToolkit.getMulticall(network);
    const tokenSelector =
      baseTokenPriceSelector ?? this.appToolkit.getBaseTokenPriceSelector({ tags: { network, appId } });

    const appTokens = dependencies.length ? await this.appToolkit.getAppTokenPositions(...dependencies) : [];

    const comptrollerContract = getComptrollerContract({ network, address: comptrollerAddress });
    const marketTokenAddressesRaw = await getAllMarkets({ contract: comptrollerContract, multicall });

    const underlyings = await Promise.all(
      marketTokenAddressesRaw.map(async marketTokenAddressRaw => {
        const marketTokenAddress = marketTokenAddressRaw.toLowerCase();
        const contract = getTokenContract({ address: marketTokenAddress, network });

        const underlyingAddressRaw = await getUnderlyingAddress({ contract, multicall }).catch(err => {
          // if the underlying call failed, it's the compound-wrapped native token
          const isCompoundWrappedNativeToken = err.message.includes('Multicall call failed for');
          if (isCompoundWrappedNativeToken) return ZERO_ADDRESS;
          throw err;
        });

        const underlyingTokenAddress = underlyingAddressRaw.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
        return { underlyingTokenAddress, marketTokenAddress };
      }),
    );

    const baseTokens = await tokenSelector.getMany(
      underlyings.map(({ underlyingTokenAddress }) => ({ network, address: underlyingTokenAddress })),
    );

    const allTokens = [...baseTokens, ...appTokens];

    const tokens = await Promise.all(
      underlyings.map(async ({ underlyingTokenAddress, marketTokenAddress }) => {
        const erc20TokenContract = this.contractFactory.erc20({ address: marketTokenAddress, network });
        const contract = getTokenContract({ address: marketTokenAddress, network });

        const underlyingToken = allTokens.find(v => v?.address === underlyingTokenAddress);
        if (!underlyingToken) return null;

        const [symbol, decimals, supplyRaw, rateRaw, supplyRateRaw, borrowRateRaw] = await Promise.all([
          multicall.wrap(erc20TokenContract).symbol(),
          multicall.wrap(erc20TokenContract).decimals(),
          multicall.wrap(erc20TokenContract).totalSupply(),
          getExchangeRate({ contract, multicall }),
          getSupplyRate({ contract, multicall }).catch(() => 0),
          getBorrowRate({ contract, multicall }).catch(() => 0),
        ]);

        // Data Props
        const type = ContractType.APP_TOKEN;
        const supply = Number(supplyRaw) / 10 ** decimals;
        const underlyingTokenDecimals = underlyingToken.decimals;
        const mantissa = getExchangeRateMantissa({ tokenDecimals: decimals, underlyingTokenDecimals });
        const pricePerShare = Number(rateRaw) / 10 ** mantissa;
        const price = pricePerShare * underlyingToken.price;
        const liquidity = price * supply;
        const tokens = [underlyingToken];
        const blocksPerDay = BLOCKS_PER_DAY[network];
        const supplyApy = getDenormalizedRate({
          blocksPerDay,
          rate: supplyRateRaw,
          decimals: underlyingToken.decimals,
        });
        const borrowApy = getDenormalizedRate({
          blocksPerDay,
          rate: borrowRateRaw,
          decimals: underlyingToken.decimals,
        });

        // Display Props
        const label = getDisplayLabel
          ? await getDisplayLabel({ contract, multicall, underlyingToken })
          : underlyingToken.symbol;
        const labelDetailed = symbol;
        const secondaryLabel = buildDollarDisplayItem(underlyingToken.price);
        const tertiaryLabel = `${(supplyApy * 100).toFixed(3)}% APY`;
        const images = [getTokenImg(underlyingToken.address, network)];
        const balanceDisplayMode = BalanceDisplayMode.UNDERLYING;
        const statsItems = [
          { label: getSupplyRateLabel(), value: buildPercentageDisplayItem(supplyApy * 100) },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ];

        const token: AppTokenPosition<CompoundSupplyTokenDataProps> = {
          type,
          address: marketTokenAddress,
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
            marketName,
            supplyApy,
            borrowApy,
            liquidity,
            comptrollerAddress,
            exchangeable,
          },

          displayProps: {
            label,
            labelDetailed,
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
