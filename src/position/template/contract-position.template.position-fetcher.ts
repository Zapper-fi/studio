import { Inject } from '@nestjs/common';
import { BigNumberish, Contract } from 'ethers/lib/ethers';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, DisplayProps, StatsItem } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
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
  abstract appId: string;
  abstract groupId: string;
  abstract network: Network;
  abstract groupLabel: string;

  isExcludedFromBalances = false;
  isExcludedFromExplore = false;
  isExcludedFromTvl = false;

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  // 1. Get contract position definitions (i.e.: contract addresses and additional context)
  abstract getDefinitions(params: GetDefinitionsParams): Promise<R[]>;

  // 2. Get contract instance
  abstract getContract(address: string): T;

  // 3. Get token definitions (supplied tokens, borrowed tokens, claimable tokens, etc.)
  async getTokenDefinitions(_params: GetTokenDefinitionsParams<T, R>): Promise<UnderlyingTokenDefinition[] | null> {
    return [];
  }

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

  getKey({ contractPosition }: { contractPosition: ContractPosition<V> }): string {
    return this.appToolkit.getPositionKey(contractPosition);
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
      .flatMap(v => v.tokenDefinitions.map(v => v.address.toLowerCase()))
      .map(v => ({ network: this.network, address: v }));
    const tokenDependencies = await tokenLoader.getMany(underlyingTokenRequests).then(tokenDeps => compact(tokenDeps));

    const skeletonsWithResolvedTokens = await Promise.all(
      compact(skeletons).map(async ({ address, tokenDefinitions, definition }) => {
        const maybeTokens = tokenDefinitions.map(v => {
          const match = tokenDependencies.find(t => t.address === v.address);
          return match ? metatyped(match, v.metaType) : null;
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
        const key = this.getKey({ contractPosition });
        return { key, ...contractPosition };
      }),
    );

    return tokens;
  }

  abstract getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<T, V>): Promise<BigNumberish[]>;

  async getBalances(address: string): Promise<ContractPositionBalance<V>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions<V>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = await Promise.all(
      contractPositions.map(async contractPosition => {
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
}
