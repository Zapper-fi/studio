import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers/lib/ethers';
import _, { compact, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, DisplayProps, StatsItem } from '~position/display.interface';
import { ContractPositionBalance, RawContractPositionBalance } from '~position/position-balance.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { metatyped } from '~position/position.utils';
import { Network } from '~types/network.interface';

import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from './contract-position.template.types';
import { PositionFetcherTemplateCommons } from './position-fetcher.template.types';

export abstract class ContractPositionTemplatePositionFetcher<
  T extends Contract,
  V extends DefaultDataProps = DefaultDataProps,
  R extends DefaultContractPositionDefinition = DefaultContractPositionDefinition,
> implements PositionFetcher<ContractPosition<V>>, PositionFetcherTemplateCommons
{
  appId: string;
  groupId: string;
  network: Network;
  abstract groupLabel: string;

  isExcludedFromBalances = false;
  isExcludedFromExplore = false;
  isExcludedFromTvl = false;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  // 1. Get contract instance
  abstract getContract(address: string): T;

  // 2. Get contract position definitions (i.e.: contract addresses and additional context)
  abstract getDefinitions(params: GetDefinitionsParams): Promise<R[]>;

  // 3. Get token definitions (supplied tokens, borrowed tokens, claimable tokens, etc.)
  abstract getTokenDefinitions(_params: GetTokenDefinitionsParams<T, R>): Promise<UnderlyingTokenDefinition[] | null>;

  // 4. Get additional data properties
  async getDataProps(_params: GetDataPropsParams<T, V, R>): Promise<V> {
    return {} as V;
  }

  // 5. Get display properties
  abstract getLabel(params: GetDisplayPropsParams<T, V, R>): Promise<string>;

  async getLabelDetailed(_params: GetDisplayPropsParams<T, V>): Promise<DisplayProps['labelDetailed']> {
    return undefined;
  }

  async getSecondaryLabel(_params: GetDisplayPropsParams<T, V>): Promise<DisplayProps['secondaryLabel']> {
    return undefined;
  }

  async getTertiaryLabel({ contractPosition }: GetDisplayPropsParams<T, V>): Promise<DisplayProps['tertiaryLabel']> {
    if (typeof contractPosition.dataProps.apy === 'number') return `${contractPosition.dataProps.apy.toFixed(3)}% APY`;
    return undefined;
  }

  async getImages({ contractPosition }: GetDisplayPropsParams<T, V>): Promise<DisplayProps['images']> {
    return contractPosition.tokens.flatMap(v => getImagesFromToken(v));
  }

  async getStatsItems({ contractPosition }: GetDisplayPropsParams<T, V>): Promise<DisplayProps['statsItems']> {
    const statsItems: StatsItem[] = [];

    // Standardized Fields
    if (typeof contractPosition.dataProps.liquidity === 'number' && Math.abs(contractPosition.dataProps.liquidity) > 0)
      statsItems.push({ label: 'Liquidity', value: buildDollarDisplayItem(contractPosition.dataProps.liquidity) });
    if (typeof contractPosition.dataProps.apy === 'number' && contractPosition.dataProps.apy > 0)
      statsItems.push({ label: 'APY', value: buildPercentageDisplayItem(contractPosition.dataProps.apy) });

    return statsItems;
  }

  // Default (adapted) Template Runner
  // Note: This will be removed in favour of an orchestrator at a higher level once all groups are migrated
  async getPositions() {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });

    const definitions = await this.getDefinitions({ multicall, tokenLoader });

    const skeletons = await Promise.all(
      definitions.map(async definition => {
        const address = definition.address.toLowerCase();
        const contract = multicall.wrap(this.getContract(definition.address));
        const context = { address, contract, definition, multicall, tokenLoader };

        const maybeTokenDefinitions = await this.getTokenDefinitions(context);
        if (!maybeTokenDefinitions) return null;

        const tokenDefinitionsArr = Array.isArray(maybeTokenDefinitions)
          ? maybeTokenDefinitions
          : [maybeTokenDefinitions];
        const tokenDefinitions = tokenDefinitionsArr.map(t => ({ ...t, address: t.address.toLowerCase() }));

        return { address, definition, tokenDefinitions };
      }),
    );

    const underlyingTokenRequests = compact(skeletons)
      .flatMap(v => v.tokenDefinitions)
      .map(v => ({ address: v.address, network: v.network, tokenId: v.tokenId }));
    const tokenDependencies = await tokenLoader.getMany(underlyingTokenRequests).then(tokenDeps => compact(tokenDeps));

    const skeletonsWithResolvedTokens = await Promise.all(
      compact(skeletons).map(({ address, tokenDefinitions, definition }) => {
        const maybeTokens = tokenDefinitions.map(definition => {
          const match = tokenDependencies.find(token => {
            const isAddressMatch = token.address === definition.address;
            const isNetworkMatch = token.network == definition.network;
            const isMaybeErc1155TokenIdMatch =
              !definition.tokenId ||
              (token.type === ContractType.APP_TOKEN && token.dataProps.tokenId === definition.tokenId);
            return isAddressMatch && isNetworkMatch && isMaybeErc1155TokenIdMatch;
          });

          if (match) {
            const tokenWithMetaType = metatyped(match, definition.metaType);

            // Since the key generation is stateful and the key is already generated for an app token, we need to
            // regenerate the key for underlying app tokens. Otherwise, we may end up in situations where underlying
            // app tokens balances are double counted.
            if (tokenWithMetaType.type === ContractType.APP_TOKEN) {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { key, ...token } = tokenWithMetaType;
              return { ...token, key: this.appToolkit.getPositionKey(token) };
            }

            return tokenWithMetaType;
          }
          return null;
        });

        const tokens = compact(maybeTokens);
        if (maybeTokens.length !== tokens.length) return null;
        return { address, tokens, definition };
      }),
    );

    const tokens = await Promise.all(
      compact(skeletonsWithResolvedTokens).map(async ({ address, tokens, definition }) => {
        const contract = multicall.wrap(this.getContract(address));
        const baseContext = { address, contract, multicall, tokenLoader, definition };

        const baseFragment: GetDataPropsParams<T, V>['contractPosition'] = {
          type: ContractType.POSITION,
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
          address,
          tokens,
        };

        // Resolve Data Props Stage
        const dataPropsStageParams = { ...baseContext, contractPosition: baseFragment };
        const dataProps = await this.getDataProps(dataPropsStageParams);

        // Resolve Display Props Stage
        const displayPropsStageFragment = { ...baseFragment, dataProps };
        const displayPropsStageParams = { ...dataPropsStageParams, contractPosition: displayPropsStageFragment };
        const displayProps = {
          label: await this.getLabel(displayPropsStageParams),
          labelDetailed: await this.getLabelDetailed(displayPropsStageParams),
          secondaryLabel: await this.getSecondaryLabel(displayPropsStageParams),
          tertiaryLabel: await this.getTertiaryLabel(displayPropsStageParams),
          images: await this.getImages(displayPropsStageParams),
          statsItems: await this.getStatsItems(displayPropsStageParams),
        };

        const contractPosition = { ...baseFragment, dataProps, displayProps };
        const key = this.appToolkit.getPositionKey(contractPosition);
        return { key, ...contractPosition };
      }),
    );

    return tokens;
  }

  async getAccountAddress(address: string) {
    return address;
  }

  async getPositionsForBalances() {
    return this.appToolkit.getAppContractPositions<V>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });
  }

  async filterPositionsForAddress(address: string, positions: ContractPosition<V>[]) {
    return positions;
  }

  abstract getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<T, V>): Promise<BigNumberish[]>;

  async getBalances(_address: string): Promise<ContractPositionBalance<V>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const address = await this.getAccountAddress(_address);
    if (address === ZERO_ADDRESS) return [];

    const contractPositions = await this.getPositionsForBalances();
    const filteredPositions = await this.filterPositionsForAddress(address, contractPositions);

    const balances = await Promise.all(
      filteredPositions.map(async contractPosition => {
        const contract = multicall.wrap(this.getContract(contractPosition.address));
        const balancesRaw = await this.getTokenBalancesPerPosition({ address, contract, contractPosition, multicall });
        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance<V> = { ...contractPosition, tokens, balanceUSD };
        return balance;
      }),
    );

    return balances;
  }

  async getRawBalances(_address: string): Promise<RawContractPositionBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const address = await this.getAccountAddress(_address);
    if (address === ZERO_ADDRESS) return [];

    const contractPositions = await this.getPositionsForBalances();
    const filteredPositions = await this.filterPositionsForAddress(address, contractPositions);

    let results: RawContractPositionBalance[] = [];
    for (const batch of _.chunk(filteredPositions, 100).values()) {
      results = results.concat(
        await Promise.all(
          batch.map(async contractPosition => {
            const contract = multicall.wrap(this.getContract(contractPosition.address));
            const balancesRaw = await this.getTokenBalancesPerPosition({
              address,
              contract,
              contractPosition,
              multicall,
            });

            return {
              key: this.appToolkit.getPositionKey(contractPosition),
              tokens: contractPosition.tokens.map((token, i) => ({
                key: this.appToolkit.getPositionKey(token),
                balance: balancesRaw[i]?.toString() ?? '0',
              })),
            };
          }),
        ),
      );
    }
    return results;
  }

  async drillRawBalances(balances: RawContractPositionBalance[]): Promise<ContractPositionBalance<V>[]> {
    const contractPositions = await this.getPositionsForBalances();

    const balancesByKey = _(balances)
      .groupBy(b => b.key)
      .mapValues(v => v[0])
      .value();

    return compact(
      contractPositions.map(contractPosition => {
        const key = this.appToolkit.getPositionKey(contractPosition);
        const positionBalances = balancesByKey[key];
        if (!positionBalances) return null;

        const positionTokensByKey = _(positionBalances.tokens)
          .groupBy(t => t.key)
          .mapValues(v => v[0])
          .value();

        const allTokens = contractPosition.tokens.map(token => {
          const key = this.appToolkit.getPositionKey(token);
          const tokenBalance = positionTokensByKey[key];
          if (!tokenBalance) return null;

          return drillBalance<typeof token, V>(token, tokenBalance.balance, {
            isDebt: token.metaType === MetaType.BORROWED,
          });
        });

        const tokens = compact(allTokens).filter(t => Math.abs(t.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        return { ...contractPosition, tokens, balanceUSD };
      }),
    );
  }
}
