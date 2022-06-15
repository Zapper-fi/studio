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
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { BalanceDisplayMode } from '~position/display.interface';
import { AppTokenPosition, ExchangeableAppTokenDataProps, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { BaseToken } from '~position/token.interface';
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
  allTokens?: (BaseToken | AppTokenPosition)[];
  comptrollerAddress: string;
  marketName?: string;
  getComptrollerContract: (opts: { address: string; network: Network }) => T;
  getTokenContract: (opts: { address: string; network: Network }) => V;
  getAllMarkets: (opts: { contract: T; multicall: Multicall }) => string[] | Promise<string[]>;
  getExchangeRate: (opts: { contract: V; multicall: Multicall }) => Promise<BigNumberish>;
  getSupplyRate: (opts: { contract: V; multicall: Multicall }) => Promise<BigNumberish>;
  getBorrowRate: (opts: { contract: V; multicall: Multicall }) => Promise<BigNumberish>;
  getUnderlyingAddress: (opts: { contract: V; multicall: Multicall }) => Promise<string>;
  getExchangeRateMantissa: (opts: { tokenDecimals: number; underlyingTokenDecimals: number }) => number;
  getDisplayLabel?: (opts: { contract: V; multicall: Multicall; underlyingToken: Token }) => Promise<string>;
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
    allTokens = [],
    getComptrollerContract,
    getTokenContract,
    getAllMarkets,
    getExchangeRate,
    getSupplyRate,
    getBorrowRate,
    getUnderlyingAddress,
    getExchangeRateMantissa,
    getDisplayLabel,
    getDenormalizedRate = ({ blocksPerDay, rate }) =>
      Math.pow(1 + (blocksPerDay * Number(rate)) / Number(1e18), 365) - 1,
  }: CompoundSupplyTokenHelperParams<T, V>) {
    const multicall = this.appToolkit.getMulticall(network);

    if (!allTokens.length) {
      const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
      const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
      allTokens.push(...appTokens, ...baseTokens);
    }

    const comptrollerContract = getComptrollerContract({ network, address: comptrollerAddress });
    const marketTokenAddressesRaw = await getAllMarkets({ contract: comptrollerContract, multicall });

    const tokens = await Promise.all(
      marketTokenAddressesRaw.map(async marketTokenAddressRaw => {
        const isDeprecated = 



        const address = marketTokenAddressRaw.toLowerCase();
        const erc20TokenContract = this.contractFactory.erc20({ address, network });
        const contract = getTokenContract({ address, network });

        const underlyingAddress = await getUnderlyingAddress({ contract, multicall })
          .then(t => t.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS))
          .catch(() => ZERO_ADDRESS);

        const underlyingToken = allTokens.find(v => v.address === underlyingAddress);
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
        const secondaryLabel = buildDollarDisplayItem(underlyingToken.price);
        const tertiaryLabel = `${(supplyApy * 100).toFixed(3)}% APY`;
        const images = [getTokenImg(underlyingToken.address, network)];
        const balanceDisplayMode = BalanceDisplayMode.UNDERLYING;
        const statsItems = [
          { label: 'Supply APY', value: buildPercentageDisplayItem(supplyApy) },
          { label: 'Borrow APR', value: buildPercentageDisplayItem(borrowApy) },
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ];

        const token: AppTokenPosition<CompoundSupplyTokenDataProps> = {
          type,
          address,
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
