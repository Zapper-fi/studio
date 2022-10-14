import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers/lib/ethers';
import { compact, intersection, isArray, partition, sortBy, sum } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { DisplayProps, StatsItem } from '~position/display.interface';
import { AppTokenPositionBalance, RawAppTokenBalance } from '~position/position-balance.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import {
  DefaultAppTokenDefinition,
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetPriceParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from './app-token.template.types';
import { PositionFetcherTemplateCommons } from './position-fetcher.template.types';

export abstract class AppTokenTemplatePositionFetcher<
  T extends Contract,
  V extends DefaultAppTokenDataProps = DefaultAppTokenDataProps,
  R extends DefaultAppTokenDefinition = DefaultAppTokenDefinition,
> implements PositionFetcher<AppTokenPosition<V>>, PositionFetcherTemplateCommons
{
  appId: string;
  groupId: string;
  network: Network;
  isDebt: boolean = false;
  abstract groupLabel: string;

  isExcludedFromBalances = false;
  isExcludedFromExplore = false;
  isExcludedFromTvl = false;

  fromNetwork?: Network;
  minLiquidity = 1000;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  // 1. Get token addresses
  abstract getAddresses(params: GetAddressesParams): string[] | Promise<string[]>;

  // 2. (Optional) Get token definitions (i.e.: token addresses and additional context)
  async getDefinitions(params: GetDefinitionsParams): Promise<R[]> {
    const addresses = await this.getAddresses({ ...params, definitions: [] });
    return addresses.map(address => ({ address: address.toLowerCase() } as R));
  }

  // 3. Get token contract instance
  abstract getContract(address: string): T;

  // 4. Get underlying token addresses
  async getUnderlyingTokenAddresses(_params: GetUnderlyingTokensParams<T, R>): Promise<string | string[]> {
    return [];
  }

  // 5A. Get symbol (ERC20 standard)
  async getSymbol({ address, multicall }: GetTokenPropsParams<T, R>): Promise<string> {
    const erc20 = this.appToolkit.globalContracts.erc20({ address, network: this.network });
    return multicall.wrap(erc20).symbol();
  }

  // 5B. Get decimals (ERC20 standard)
  async getDecimals({ address, multicall }: GetTokenPropsParams<T, R>): Promise<number> {
    const erc20 = this.appToolkit.globalContracts.erc20({ address, network: this.network });
    return multicall.wrap(erc20).decimals();
  }

  // 5C. Get supply (ERC20 standard)
  async getSupply({ address, multicall }: GetTokenPropsParams<T, R>): Promise<BigNumberish> {
    const erc20 = this.appToolkit.globalContracts.erc20({ address, network: this.network });
    return multicall.wrap(erc20).totalSupply();
  }

  // 6. Get price per share (ratio between token and underlying token)
  async getPricePerShare(_params: GetPricePerShareParams<T, V, R>): Promise<number | number[]> {
    return 1;
  }

  // 7. Get price using the price per share
  async getPrice({ appToken }: GetPriceParams<T, V, R>): Promise<number> {
    return sum(appToken.tokens.map((v, i) => v.price * appToken.pricePerShare[i]));
  }

  abstract getLiquidity(params: GetDataPropsParams<T, V, R>): number | Promise<number>;
  abstract getReserves(params: GetDataPropsParams<T, V, R>): number[] | Promise<number[]>;
  abstract getApy(params: GetDataPropsParams<T, V, R>): number | Promise<number>;

  async getDataProps(params: GetDataPropsParams<T, V, R>): Promise<V> {
    const [liquidity, reserves, apy] = await Promise.all([
      this.getLiquidity(params),
      this.getReserves(params),
      this.getApy(params),
    ]);

    return { liquidity, reserves, apy } as V;
  }

  // Display Properties
  async getLabel({ appToken }: GetDisplayPropsParams<T, V, R>): Promise<DisplayProps['label']> {
    return appToken.symbol;
  }

  async getLabelDetailed(_params: GetDisplayPropsParams<T, V, R>): Promise<DisplayProps['labelDetailed']> {
    return undefined;
  }

  async getSecondaryLabel({ appToken }: GetDisplayPropsParams<T, V, R>): Promise<DisplayProps['secondaryLabel']> {
    return buildDollarDisplayItem(appToken.price);
  }

  async getTertiaryLabel({ appToken }: GetDisplayPropsParams<T, V, R>): Promise<DisplayProps['tertiaryLabel']> {
    if (typeof appToken.dataProps.apy === 'number' && appToken.dataProps.apy > 0)
      return `${appToken.dataProps.apy.toFixed(3)}% APY`;
    return undefined;
  }

  async getImages({ appToken }: GetDisplayPropsParams<T, V, R>): Promise<DisplayProps['images']> {
    return appToken.tokens.flatMap(v => getImagesFromToken(v));
  }

  async getBalanceDisplayMode(_params: GetDisplayPropsParams<T, V, R>): Promise<DisplayProps['balanceDisplayMode']> {
    return undefined;
  }

  async getStatsItems({ appToken }: GetDisplayPropsParams<T, V, R>): Promise<DisplayProps['statsItems']> {
    const statsItems: StatsItem[] = [];

    // Standardized Fields
    if (typeof appToken.dataProps.liquidity === 'number')
      statsItems.push({ label: 'Liquidity', value: buildDollarDisplayItem(appToken.dataProps.liquidity) });
    if (typeof appToken.dataProps.apy === 'number' && appToken.dataProps.apy > 0)
      statsItems.push({ label: 'APY', value: buildPercentageDisplayItem(appToken.dataProps.apy) });

    return statsItems;
  }

  getKey({ appToken }: { appToken: AppTokenPosition<V> }): string {
    return this.appToolkit.getPositionKey(appToken);
  }

  // Default (adapted) Template Runner
  // Note: This will be removed in favour of an orchestrator at a higher level once all groups are migrated
  async getPositions(): Promise<AppTokenPosition<V>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });

    const definitions = await this.getDefinitions({ multicall, tokenLoader });
    const addressesRaw = await this.getAddresses({ multicall, definitions });
    const addresses = addressesRaw.map(x => x.toLowerCase());

    const maybeSkeletons = await Promise.all(
      addresses.map(async address => {
        const definition = definitions.find(v => v.address.toLowerCase() === address);
        if (!definition) return null;

        const contract = multicall.wrap(this.getContract(address));
        const context = { address, definition, contract, multicall, tokenLoader };

        const underlyingTokenAddresses = await this.getUnderlyingTokenAddresses(context)
          .then(v => (Array.isArray(v) ? v : [v]))
          .then(v => v.map(t => t.toLowerCase()))
          .catch(err => {
            if (isMulticallUnderlyingError(err)) return null;
            throw err;
          });

        if (!underlyingTokenAddresses) return null;
        return { address, definition, underlyingTokenAddresses };
      }),
    );

    const skeletons = compact(maybeSkeletons);
    const [base, meta] = partition(skeletons, t => {
      const tokenAddresses = skeletons.map(v => v.address);
      return intersection(t.underlyingTokenAddresses, tokenAddresses).length === 0;
    });

    const currentTokens: AppTokenPosition<V>[] = [];
    for (const skeletonsSubset of [base, meta]) {
      const underlyingTokenRequests = skeletons
        .flatMap(v => v.underlyingTokenAddresses)
        .map(v => ({ network: this.fromNetwork ?? this.network, address: v }));
      const tokenDependencies = await tokenLoader
        .getMany(underlyingTokenRequests)
        .then(tokenDeps => compact(tokenDeps));
      const allTokens = [...currentTokens, ...tokenDependencies];

      const skeletonsWithResolvedTokens = await Promise.all(
        skeletonsSubset.map(async ({ address, definition, underlyingTokenAddresses }) => {
          const maybeTokens = underlyingTokenAddresses.map(v => allTokens.find(t => t.address === v));
          const tokens = compact(maybeTokens);

          if (maybeTokens.length !== tokens.length) return null;
          return { address, definition, tokens };
        }),
      );

      const tokens = await Promise.all(
        compact(skeletonsWithResolvedTokens).map(async ({ address, definition, tokens }) => {
          const contract = multicall.wrap(this.getContract(address));
          const baseContext = { address, contract, multicall, tokenLoader, definition };

          const [symbol, decimals, totalSupplyRaw] = await Promise.all([
            this.getSymbol(baseContext),
            this.getDecimals(baseContext),
            this.getSupply(baseContext),
          ]);

          const supply = Number(totalSupplyRaw) / 10 ** decimals;

          const baseFragment: GetPricePerShareParams<T, V, R>['appToken'] = {
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
          const pricePerShareContext = { ...baseContext, appToken: baseFragment };
          const pricePerShare = await this.getPricePerShare(pricePerShareContext).then(v => (isArray(v) ? v : [v]));

          // Resolve Price Stage
          const priceStageFragment = { ...baseFragment, pricePerShare };
          const priceContext = { ...baseContext, appToken: priceStageFragment };
          const price = await this.getPrice(priceContext);

          // Resolve Data Props Stage
          const dataPropsStageFragment = { ...priceStageFragment, price };
          const dataPropsStageParams = { ...baseContext, appToken: dataPropsStageFragment };
          const dataProps = await this.getDataProps(dataPropsStageParams);

          // Resolve Display Props Stage
          const displayPropsStageFragment = { ...dataPropsStageFragment, dataProps };
          const displayPropsStageParams = { ...baseContext, appToken: displayPropsStageFragment };
          const displayProps = {
            label: await this.getLabel(displayPropsStageParams),
            labelDetailed: await this.getLabelDetailed(displayPropsStageParams),
            secondaryLabel: await this.getSecondaryLabel(displayPropsStageParams),
            tertiaryLabel: await this.getTertiaryLabel(displayPropsStageParams),
            images: await this.getImages(displayPropsStageParams),
            statsItems: await this.getStatsItems(displayPropsStageParams),
            balanceDisplayMode: await this.getBalanceDisplayMode(displayPropsStageParams),
          };

          const appToken = { ...displayPropsStageFragment, displayProps };
          const key = this.getKey({ appToken });
          return { key, ...appToken };
        }),
      );

      const positionsSubset = compact(tokens);
      currentTokens.push(...positionsSubset);
    }

    return sortBy(currentTokens, t => {
      if (typeof t.dataProps.liquidity === 'number') return -t.dataProps.liquidity;
      return 1;
    });
  }

  getBalancePerToken({
    address,
    appToken,
    multicall,
  }: {
    address: string;
    appToken: AppTokenPosition;
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
        const tokenBalance = drillBalance(appToken, balanceRaw.toString(), { isDebt: this.isDebt });
        return tokenBalance;
      }),
    );

    return balances as AppTokenPositionBalance<V>[];
  }

  async getRawBalances(address: string): Promise<RawAppTokenBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    return Promise.all(
      appTokens.map(async appToken => ({
        key: this.appToolkit.getPositionKey(appToken),
        balance: (await this.getBalancePerToken({ multicall, address, appToken })).toString(),
      })),
    );
  }

  async drillRawBalances(balances: RawAppTokenBalance[]): Promise<AppTokenPositionBalance<V>[]> {
    const appTokens = await this.appToolkit.getAppTokenPositions<V>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const appTokenBalances = appTokens.map(token => {
      const tokenBalance = balances.find(b => b.key === this.appToolkit.getPositionKey(token));
      if (!tokenBalance) return null;

      const result = drillBalance<typeof token, V>(token, tokenBalance.balance, { isDebt: this.isDebt });
      return result;
    });

    return compact(appTokenBalances);
  }
}
