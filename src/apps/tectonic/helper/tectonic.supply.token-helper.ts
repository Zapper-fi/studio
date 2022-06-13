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
import { AppTokenPosition, Token } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types/network.interface';

import { TectonicCore, TectonicContractFactory, TectonicTToken } from '../contracts';

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
  getAllMarkets: (opts: { contract: T; multicall: Multicall }) => string[] | Promise<string[]>;
  getExchangeRate: (opts: { contract: V; multicall: Multicall }) => Promise<BigNumberish>;
  getSupplyRate: (opts: { contract: V; multicall: Multicall }) => Promise<BigNumberish>;
  getBorrowRate: (opts: { contract: V; multicall: Multicall }) => Promise<BigNumberish>;
  getUnderlyingAddress: (opts: { contract: V; multicall: Multicall }) => Promise<string>;
  getExchangeRateMantissa: (opts: { tokenDecimals: number; underlyingTokenDecimals: number }) => number;
  getDisplayLabel?: (opts: { contract: V; multicall: Multicall; underlyingToken: Token }) => Promise<string>;
  getDenormalizedRate?: (opts: { rate: BigNumberish; blocksPerDay: number; decimals: number }) => number;
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
    getSupplyRate,
    getBorrowRate,
    getUnderlyingAddress,
    getExchangeRateMantissa,
    getDisplayLabel,
    getDenormalizedRate = ({ blocksPerDay, rate }) =>
      Math.pow(1 + (blocksPerDay * Number(rate)) / Number(1e18), 365) - 1,
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
        const erc20TokenContract = this.contractFactory.erc20({ address, network });
        const contract = getTokenContract({ address, network });

        const underlyingAddress = await getUnderlyingAddress({ contract, multicall })
          .then(t => t.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS))
          .catch(() => ZERO_ADDRESS);

        const underlyingToken = allTokens.find(v => v.address === underlyingAddress);
        if (!underlyingToken) return null;

        const [symbol, decimals, supplyRaw, rateRaw, supplyRateRaw, borrowRateRaw] = await Promise.all([
          erc20TokenContract.symbol(),
          erc20TokenContract.decimals(),
          erc20TokenContract.totalSupply(),
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
          { label: 'Liquidity', value: buildDollarDisplayItem(liquidity) },
        ];

        const token: AppTokenPosition<TectonicSupplyTokenDataProps> = {
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
