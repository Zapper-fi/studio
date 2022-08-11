import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers/lib/ethers';
import { compact, intersection, isArray, partition, sum } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts';
import { IMulticallWrapper } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, DisplayProps, StatsItem } from '~position/display.interface';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

export type StageParams<T extends Contract, V, K extends keyof AppTokenPosition> = {
  multicall: IMulticallWrapper;
  contract: T;
  appToken: Omit<AppTokenPosition<V>, K>;
};

export type TokenPropsStageParams<T> = {
  address: string;
  contract: T;
  multicall: IMulticallWrapper;
};

export type UnderlyingTokensStageParams<T> = {
  address: string;
  contract: T;
  multicall: IMulticallWrapper;
};

export type PricePerShareStageParams<T extends Contract, V extends DefaultDataProps = DefaultDataProps> = StageParams<
  T,
  V,
  'pricePerShare' | 'price' | 'dataProps' | 'displayProps'
>;
export type PriceStageParams<T extends Contract, V extends DefaultDataProps = DefaultDataProps> = StageParams<
  T,
  V,
  'price' | 'dataProps' | 'displayProps'
>;
export type DataPropsStageParams<T extends Contract, V extends DefaultDataProps = DefaultDataProps> = StageParams<
  T,
  V,
  'dataProps' | 'displayProps'
>;
export type DisplayPropsStageParams<T extends Contract, V extends DefaultDataProps = DefaultDataProps> = StageParams<
  T,
  V,
  'displayProps'
>;

export abstract class AppTokenTemplatePositionFetcher<
  T extends Contract = Erc20,
  V extends DefaultDataProps = DefaultDataProps,
> implements PositionFetcher<AppTokenPosition<V>>
{
  abstract appId: string;
  abstract groupId: string;
  abstract network: Network;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  abstract getAddresses(): Promise<string[]>;

  // Contract
  getContract(address: string): T {
    return this.appToolkit.globalContracts.erc20({ address, network: this.network }) as unknown as T;
  }

  // Token Props
  async getSymbol({ contract }: TokenPropsStageParams<T>): Promise<string> {
    return (contract as unknown as Erc20).symbol();
  }

  async getDecimals({ contract }: TokenPropsStageParams<T>): Promise<number> {
    return (contract as unknown as Erc20).decimals();
  }

  async getSupply({ contract }: TokenPropsStageParams<T>): Promise<BigNumberish> {
    return (contract as unknown as Erc20).totalSupply();
  }

  // Price Properties
  async getUnderlyingTokenAddresses(_params: UnderlyingTokensStageParams<T>): Promise<string | string[]> {
    return [];
  }

  async getPricePerShare(_params: PricePerShareStageParams<T, V>): Promise<number | number[]> {
    return 1;
  }

  async getPrice({ appToken }: PriceStageParams<T, V>): Promise<number> {
    return sum(appToken.tokens.map((v, i) => v.price * appToken.pricePerShare[i]));
  }

  // Data Properties
  async getDataProps(_params: DataPropsStageParams<T, V>): Promise<V> {
    return {} as V;
  }

  // Display Properties
  async getLabel({ appToken }: DisplayPropsStageParams<T, V>): Promise<DisplayProps['label']> {
    return appToken.symbol;
  }

  async getLabelDetailed(_params: DisplayPropsStageParams<T, V>): Promise<DisplayProps['labelDetailed']> {
    return undefined;
  }

  async getSecondaryLabel({ appToken }: DisplayPropsStageParams<T, V>): Promise<DisplayProps['secondaryLabel']> {
    return buildDollarDisplayItem(appToken.price);
  }

  async getTertiaryLabel({ appToken }: DisplayPropsStageParams<T, V>): Promise<DisplayProps['tertiaryLabel']> {
    if (typeof appToken.dataProps.apy === 'number') return `${appToken.dataProps.apy.toFixed(3)}% APY`;
    return undefined;
  }

  async getImages({ appToken }: DisplayPropsStageParams<T, V>): Promise<DisplayProps['images']> {
    return appToken.tokens.flatMap(v => getImagesFromToken(v));
  }

  async getStatsItems({ appToken }: DisplayPropsStageParams<T, V>): Promise<DisplayProps['statsItems']> {
    const statsItems: StatsItem[] = [];

    // Standardized Fields
    if (typeof appToken.dataProps.liquidity === 'number')
      statsItems.push({ label: 'Liquidity', value: buildDollarDisplayItem(appToken.dataProps.liquidity) });
    if (typeof appToken.dataProps.apy === 'number')
      statsItems.push({ label: 'APY', value: buildPercentageDisplayItem(appToken.dataProps.apy) });

    return statsItems;
  }

  // Default (adapted) Template Runner
  // Note: This will be removed in favour of an orchestrator at a higher level once all groups are migrated
  async getPositions(): Promise<AppTokenPosition<V>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getBaseTokenPriceSelector({
      tags: { network: this.network, appId: `${this.appId}__template` },
    });
    const appTokenLoader = this.appToolkit.getAppTokenSelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });

    const addresses = await this.getAddresses();

    const skeletons = await Promise.all(
      addresses.map(async address => {
        const contract = multicall.wrap(this.getContract(address));
        const underlyingTokenAddresses = await this.getUnderlyingTokenAddresses({ address, contract, multicall })
          .then(v => (Array.isArray(v) ? v : [v]))
          .then(v => v.map(t => t.toLowerCase()));

        return { address, underlyingTokenAddresses };
      }),
    );

    const [base, meta] = partition(skeletons, t => {
      const tokenAddresses = skeletons.map(v => v.address);
      return intersection(t.underlyingTokenAddresses, tokenAddresses).length === 0;
    });

    console.log('HELLO: ', JSON.stringify(meta, null, 2));

    const currentTokens: AppTokenPosition<V>[] = [];
    for (const skeletonsSubset of [base, meta]) {
      const underlyingTokenRequests = skeletonsSubset
        .flatMap(v => v.underlyingTokenAddresses)
        .map(v => ({ network: this.network, address: v }));
      const baseTokens = await tokenLoader.getMany(underlyingTokenRequests);
      const appTokens = await appTokenLoader.getMany(underlyingTokenRequests);
      const allTokens = [...currentTokens, ...compact(appTokens), ...compact(baseTokens)];

      const skeletonsWithResolvedTokens = await Promise.all(
        skeletonsSubset.map(async ({ address, underlyingTokenAddresses }) => {
          const maybeTokens = underlyingTokenAddresses.map(v => allTokens.find(t => t.address === v));
          const tokens = compact(maybeTokens);

          if (maybeTokens.length !== tokens.length) return null;
          return { address, tokens };
        }),
      );

      const tokens = await Promise.all(
        compact(skeletonsWithResolvedTokens).map(async ({ address, tokens }) => {
          const contract = multicall.wrap(this.getContract(address));
          const [symbol, decimals, totalSupplyRaw] = await Promise.all([
            this.getSymbol({ address, contract, multicall }),
            this.getDecimals({ address, contract, multicall }),
            this.getSupply({ address, contract, multicall }),
          ]);

          const supply = Number(totalSupplyRaw) / 10 ** decimals;

          const fragment: PricePerShareStageParams<T, V>['appToken'] = {
            type: ContractType.APP_TOKEN,
            appId: this.appId,
            groupId: this.groupId,
            network: this.network,
            address,
            symbol,
            decimals,
            supply,
            tokens,
          };

          // Resolve price per share stage
          const pricePerShareStageParams = { appToken: fragment, contract, multicall };
          const pricePerShare = await this.getPricePerShare(pricePerShareStageParams).then(v => (isArray(v) ? v : [v]));

          // Resolve Price Stage
          const priceStageFragment = { ...pricePerShareStageParams.appToken, pricePerShare };
          const priceStageParams = { appToken: priceStageFragment, contract, multicall };
          const price = await this.getPrice(priceStageParams);

          // Resolve Data Props Stage
          const dataPropsStageFragment = { ...priceStageParams.appToken, price };
          const dataPropsStageParams = { appToken: dataPropsStageFragment, contract, multicall };
          const dataProps = await this.getDataProps(dataPropsStageParams);

          // Resolve Display Props Stage
          const displayPropsStageFragment = { ...dataPropsStageParams.appToken, dataProps };
          const displayPropsStageParams = { appToken: displayPropsStageFragment, contract, multicall };
          const displayProps = {
            label: await this.getLabel(displayPropsStageParams),
            labelDetailed: await this.getLabelDetailed(displayPropsStageParams),
            secondarylabel: await this.getSecondaryLabel(displayPropsStageParams),
            tertiaryLabel: await this.getTertiaryLabel(displayPropsStageParams),
            images: await this.getImages(displayPropsStageParams),
            statsItems: await this.getStatsItems(displayPropsStageParams),
          };

          return { ...displayPropsStageFragment, displayProps };
        }),
      );

      const positionsSubset = compact(tokens).filter(v => {
        if (typeof v.dataProps.liquidity === 'number') return Math.abs(v.dataProps.liquidity) > 1000;
        return true;
      });

      currentTokens.push(...positionsSubset);
    }

    return currentTokens;
  }

  getBalancePerToken({
    address,
    appToken,
    multicall,
  }: {
    address: string;
    appToken: AppTokenPosition<V>;
    multicall: IMulticallWrapper;
  }): Promise<BigNumberish> {
    return multicall.wrap(this.getContract(appToken.address)).balanceOf(address);
  }

  async getBalances(address: string): Promise<AppTokenPositionBalance<V>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions<V>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      appTokens.map(async appToken => {
        const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
        const tokenBalance = drillBalance(appToken, balanceRaw.toString());
        return tokenBalance;
      }),
    );

    return balances as AppTokenPositionBalance<V>[];
  }
}
