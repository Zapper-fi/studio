import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers/lib/ethers';
import { compact, sum } from 'lodash';

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
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

export type StageParams<T extends Contract, V, K extends keyof AppTokenPosition> = {
  multicall: IMulticallWrapper;
  contract: T;
  appToken: Omit<AppTokenPosition<V>, K>;
};

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
  dependencies: AppGroupsDefinition[] = [];

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  abstract getAddresses(): Promise<string[]>;

  // Contract
  getContract(address: string): T {
    return this.appToolkit.globalContracts.erc20({ address, network: this.network }) as unknown as T;
  }

  // Token Props
  async getSymbol(contract: T): Promise<string> {
    return (contract as unknown as Erc20).symbol();
  }

  async getDecimals(contract: T): Promise<number> {
    return (contract as unknown as Erc20).decimals();
  }

  async getSupply(contract: T): Promise<BigNumberish> {
    return (contract as unknown as Erc20).totalSupply();
  }

  // Price Properties
  async getUnderlyingTokenAddresses(_contract: T): Promise<string | string[]> {
    return [];
  }

  async getPricePerShare(_contract: T): Promise<number | number[]> {
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
    const tokenLoader = this.appToolkit.getBaseTokenPriceSelector();
    const addresses = await this.getAddresses();

    const skeletons = await Promise.all(
      addresses.map(async address => {
        const contract = multicall.wrap(this.getContract(address));
        const underlyingTokenAddresses = await this.getUnderlyingTokenAddresses(contract)
          .then(v => (Array.isArray(v) ? v : [v]))
          .then(v => v.map(t => t.toLowerCase()));

        return { address, underlyingTokenAddresses };
      }),
    );

    const baseTokensRequests = skeletons
      .flatMap(v => v.underlyingTokenAddresses)
      .map(v => ({ network: this.network, address: v }));
    const baseTokens = await tokenLoader.getMany(baseTokensRequests);
    const appTokens = await this.appToolkit.getAppTokenPositions(...this.dependencies);
    const allTokens = [...appTokens, ...compact(baseTokens)];

    const skeletonsWithResolvedTokens = await Promise.all(
      skeletons.map(async ({ address, underlyingTokenAddresses }) => {
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
          this.getSymbol(contract),
          this.getDecimals(contract),
          this.getSupply(contract),
        ]);

        const supply = Number(totalSupplyRaw) / 10 ** decimals;
        const pricePerShare = await this.getPricePerShare(contract).then(v => (Array.isArray(v) ? v : [v]));

        const fragment: PriceStageParams<T, V>['appToken'] = {
          type: ContractType.APP_TOKEN,
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
          address,
          symbol,
          decimals,
          supply,
          pricePerShare,
          tokens,
        };

        // Resolve Price Stage
        const priceStageParams = { appToken: fragment, contract, multicall };
        const price = await this.getPrice(priceStageParams);

        // Resolve Data Props Stage
        const dataPropsStageParams = { appToken: { ...fragment, price }, contract, multicall };
        const dataProps = await this.getDataProps(dataPropsStageParams);

        // Resolve Display Props Stage
        const displayPropsStageParams = { appToken: { ...fragment, price, dataProps }, contract, multicall };
        const displayProps = {
          label: await this.getLabel(displayPropsStageParams),
          labelDetailed: await this.getLabelDetailed(displayPropsStageParams),
          secondarylabel: await this.getSecondaryLabel(displayPropsStageParams),
          tertiaryLabel: await this.getTertiaryLabel(displayPropsStageParams),
          images: await this.getImages(displayPropsStageParams),
          statsItems: await this.getStatsItems(displayPropsStageParams),
        };

        return { ...fragment, price, dataProps, displayProps };
      }),
    );

    return compact(tokens).filter(v => {
      if (typeof v.dataProps.liquidity === 'number') return v.dataProps.liquidity > 1000;
      return true;
    });
  }
}
