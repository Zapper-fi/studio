import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers/lib/ethers';
import _, { isEqual, isUndefined, uniqWith, compact, intersection, isArray, partition, sortBy, sum } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
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
import { AppTokenPosition, isNonFungibleToken, NonFungibleToken } from '~position/position.interface';
import { BaseToken } from '~position/token.interface';
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
  UnderlyingTokenDefinition,
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
  isDebt = false;
  abstract groupLabel: string;

  isExcludedFromBalances = false;
  isExcludedFromExplore = false;
  isExcludedFromTvl = false;

  minLiquidity = 1000;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  // 1. Get token contract instance
  abstract getContract(address: string): T;

  // 2. Get token addresses
  abstract getAddresses(params: GetAddressesParams): string[] | Promise<string[]>;

  // 3. (Optional) Get token definitions (i.e.: token addresses and additional context)
  async getDefinitions(params: GetDefinitionsParams): Promise<R[]> {
    const addresses = await this.getAddresses({ ...params, definitions: [] });
    return addresses.map(address => ({ address: address.toLowerCase() } as R));
  }

  // 4. Get underlying token addresses
  abstract getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<T, R>,
  ): Promise<UnderlyingTokenDefinition[]>;

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
  abstract getPricePerShare(_params: GetPricePerShareParams<T, V, R>): Promise<number[]>;

  // 7. Get price using the price per share
  async getPrice({ appToken }: GetPriceParams<T, V, R>): Promise<number> {
    return sum(appToken.tokens.map((v, i) => v.price * appToken.pricePerShare[i]));
  }

  async getLiquidity({ appToken }: GetDataPropsParams<T, V, R>): Promise<number> {
    return (this.isDebt ? -1 : 1) * appToken.price * appToken.supply;
  }

  async getReserves({ appToken }: GetDataPropsParams<T, V, R>) {
    return (appToken.pricePerShare as number[]).map(v => v * appToken.supply);
  }

  async getApy(_params: GetDataPropsParams<T, V, R>) {
    return 0;
  }

  async getDataProps(params: GetDataPropsParams<T, V, R>): Promise<V> {
    const [liquidity, reserves, apy] = await Promise.all([
      this.getLiquidity(params),
      this.getReserves(params),
      this.getApy(params),
    ]);

    return { liquidity, reserves, apy, isDebt: this.isDebt } as V;
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

  async getPositionsForBatch(definitions: R[]) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });

    const maybeSkeletons = await Promise.all(
      definitions.map(async definition => {
        const address = definition.address.toLowerCase();
        const contract = multicall.wrap(this.getContract(address));
        const context = { address, definition, contract, multicall, tokenLoader };

        const underlyingTokenDefinitions = await this.getUnderlyingTokenDefinitions(context)
          .then(v => v.map(t => ({ address: t.address.toLowerCase(), network: t.network, tokenId: t.tokenId })))
          .catch(err => {
            if (isMulticallUnderlyingError(err)) return null;
            throw err;
          });

        if (!underlyingTokenDefinitions) return null;
        return { address, definition, underlyingTokenDefinitions };
      }),
    );

    const skeletons = compact(maybeSkeletons);
    const [base, meta] = partition(skeletons, t => {
      const tokenAddresses = skeletons.map(v => v.address);
      const underlyingTokenAddresses = t.underlyingTokenDefinitions.map(v => v.address);
      return intersection(underlyingTokenAddresses, tokenAddresses).length === 0;
    });

    const currentTokens: AppTokenPosition<V>[] = [];
    for (const skeletonsSubset of [base, meta]) {
      const underlyingTokenQueries = skeletons.flatMap(v => v.underlyingTokenDefinitions);
      const underlyingTokenRequestsUnique = uniqWith(underlyingTokenQueries, isEqual);
      const tokenDependencies = await tokenLoader
        .getMany(underlyingTokenRequestsUnique)
        .then(tokenDeps => compact(tokenDeps));
      const allTokens = [...currentTokens, ...tokenDependencies];

      const skeletonsWithResolvedTokens = await Promise.all(
        skeletonsSubset.map(async ({ address, definition, underlyingTokenDefinitions }) => {
          const maybeTokens = underlyingTokenDefinitions.map(definition => {
            const match = allTokens.find(token => {
              const isAddressMatch = token.address === definition.address;
              const isNetworkMatch = token.network === definition.network;
              const isMaybeTokenIdMatch =
                isUndefined(definition.tokenId) ||
                (token.type === ContractType.APP_TOKEN && token.dataProps.tokenId === definition.tokenId) ||
                (token.type === ContractType.NON_FUNGIBLE_TOKEN &&
                  Number(token.assets?.[0].tokenId) === definition.tokenId);

              return isAddressMatch && isNetworkMatch && isMaybeTokenIdMatch;
            });

            return match;
          });

          const tokens = compact(maybeTokens);

          if (maybeTokens.length !== tokens.length) return null;

          // @TODO Temporary; the current shape of the underlying NFT token is by collection
          // Collapse same-collection NFT tokens until we refactor the Studio NFT token domain model
          const collapsedTokens = tokens.reduce<(BaseToken | AppTokenPosition | NonFungibleToken)[]>((acc, token) => {
            if (token.type !== ContractType.NON_FUNGIBLE_TOKEN) return [...acc, token];

            const existingNftCollection = acc
              .filter(isNonFungibleToken)
              .find(v => v.address === token.address && v.network === token.network);

            if (existingNftCollection) {
              existingNftCollection.assets ??= [];
              existingNftCollection.assets.push(...(token.assets ?? []));
              existingNftCollection.assets = existingNftCollection.assets.slice(0, 5);
              return acc;
            }

            return [...acc, token];
          }, []);

          return { address, definition, tokens: collapsedTokens };
        }),
      );

      const tokens = await Promise.all(
        compact(skeletonsWithResolvedTokens).map(async ({ address, definition, tokens }) => {
          const contract = multicall.wrap(this.getContract(address));
          const baseContext = { address, contract, multicall, tokenLoader, definition };
          const baseFragment: GetTokenPropsParams<T, V, R>['appToken'] = {
            type: ContractType.APP_TOKEN,
            appId: this.appId,
            groupId: this.groupId,
            network: this.network,
            address,
            tokens,
          };

          const tokenPropsContext = { ...baseContext, appToken: baseFragment };
          const [symbol, decimals, totalSupplyRaw] = await Promise.all([
            this.getSymbol(tokenPropsContext),
            this.getDecimals(tokenPropsContext),
            this.getSupply(tokenPropsContext),
          ]);

          const supply = Number(totalSupplyRaw) / 10 ** decimals;

          // Resolve price per share stage
          const pricePerShareStageFragment = { ...baseFragment, symbol, decimals, supply };
          const pricePerShareContext = { ...baseContext, appToken: pricePerShareStageFragment };
          const pricePerShare = await this.getPricePerShare(pricePerShareContext).then(v => (isArray(v) ? v : [v]));

          // Resolve Price Stage
          const priceStageFragment = { ...pricePerShareStageFragment, pricePerShare };
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
          const key = this.appToolkit.getPositionKey(appToken);
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

  // Default (adapted) Template Runner
  // Note: This will be removed in favour of an orchestrator at a higher level once all groups are migrated
  async getPositions(): Promise<AppTokenPosition<V>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });

    const definitions = await this.getDefinitions({ multicall, tokenLoader });
    return this.getPositionsForBatch(definitions);
  }

  async getAccountAddress(address: string) {
    return address;
  }

  async getPositionsForBalances() {
    return this.appToolkit.getAppTokenPositions<V>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });
  }

  async getBalancePerToken({
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

  async getBalances(_address: string): Promise<AppTokenPositionBalance<V>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const address = await this.getAccountAddress(_address);
    const appTokens = await this.getPositionsForBalances();
    if (address === ZERO_ADDRESS) return [];

    const balances = await Promise.all(
      appTokens.map(async appToken => {
        const balanceRaw = await this.getBalancePerToken({ multicall, address, appToken });
        const tokenBalance = drillBalance(appToken, balanceRaw.toString(), { isDebt: this.isDebt });
        return tokenBalance;
      }),
    );

    return balances as AppTokenPositionBalance<V>[];
  }

  async getRawBalances(_address: string): Promise<RawAppTokenBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const address = await this.getAccountAddress(_address);
    if (address === ZERO_ADDRESS) return [];

    const appTokens = await this.getPositionsForBalances();
    let results: RawAppTokenBalance[] = [];
    for (const batch of _.chunk(appTokens, 100).values()) {
      results = results.concat(
        await Promise.all(
          batch.map(async appToken => ({
            key: this.appToolkit.getPositionKey(appToken),
            balance: (await this.getBalancePerToken({ multicall, address, appToken })).toString(),
          })),
        ),
      );
    }
    return results;
  }

  async drillRawBalances(balances: RawAppTokenBalance[]): Promise<AppTokenPositionBalance<V>[]> {
    const appTokens = await this.getPositionsForBalances();

    const balancesByKey = _(balances)
      .groupBy(b => b.key)
      .mapValues(v => v[0])
      .value();

    const appTokenBalances = appTokens.map(token => {
      const key = this.appToolkit.getPositionKey(token);
      const tokenBalance = balancesByKey[key];
      if (!tokenBalance) return null;

      const result = drillBalance<typeof token, V>(token, tokenBalance.balance, { isDebt: this.isDebt });
      return result;
    });

    return compact(appTokenBalances);
  }
}
