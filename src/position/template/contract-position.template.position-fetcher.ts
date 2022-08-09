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
import { IMulticallWrapper } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, DisplayProps, StatsItem } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { Network } from '~types/network.interface';

export type DefaultContractPositionDescriptor = {
  address: string;
};

export type StageParams<T extends Contract, V, K extends keyof ContractPosition> = {
  multicall: IMulticallWrapper;
  contract: T;
  appToken: Omit<ContractPosition<V>, K>;
};

export type DataPropsStageParams<T extends Contract, V> = StageParams<T, V, 'dataProps' | 'displayProps'>;
export type DisplayPropsStageParams<T extends Contract, V> = StageParams<T, V, 'displayProps'>;

export abstract class ContractPositionTemplatePositionFetcher<
  T extends Contract,
  V extends DefaultDataProps = DefaultDataProps,
  R extends DefaultContractPositionDescriptor = DefaultContractPositionDescriptor,
> implements PositionFetcher<ContractPosition<V>>
{
  abstract appId: string;
  abstract groupId: string;
  abstract network: Network;
  dependencies: AppGroupsDefinition[] = [];

  constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

  abstract getDescriptors(): Promise<R[]>;
  abstract getContract(address: string): T;
  abstract getLabel(params: DisplayPropsStageParams<T, V>): Promise<string>;

  // Tokens
  async getTokenAddresses(_contract: T, _descriptor: R): Promise<string | string[]> {
    return [];
  }

  // Data Properties
  async getDataProps(_params: DataPropsStageParams<T, V>): Promise<V> {
    return {} as V;
  }

  async getLabelDetailed(_params: DisplayPropsStageParams<T, V>): Promise<DisplayProps['labelDetailed']> {
    return undefined;
  }

  async getSecondaryLabel(_params: DisplayPropsStageParams<T, V>): Promise<DisplayProps['secondaryLabel']> {
    return undefined;
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
  async getPositions() {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getBaseTokenPriceSelector();
    const descriptors = await this.getDescriptors();

    const skeletons = await Promise.all(
      descriptors.map(async descriptor => {
        const contract = multicall.wrap(this.getContract(descriptor.address));
        const tokenAddresses = await this.getTokenAddresses(contract, descriptor)
          .then(v => (Array.isArray(v) ? v : [v]))
          .then(v => v.map(t => t.toLowerCase()));

        return { ...descriptor, tokenAddresses };
      }),
    );

    const baseTokensRequests = skeletons
      .flatMap(v => v.tokenAddresses)
      .map(v => ({ network: this.network, address: v }));
    const baseTokens = await tokenLoader.getMany(baseTokensRequests);
    const appTokens = await this.appToolkit.getAppTokenPositions(...this.dependencies);
    const allTokens = [...appTokens, ...compact(baseTokens)];

    const skeletonsWithResolvedTokens = await Promise.all(
      skeletons.map(async ({ address, tokenAddresses, ...rest }) => {
        const maybeTokens = tokenAddresses.map(v => allTokens.find(t => t.address === v));
        const tokens = compact(maybeTokens);

        if (maybeTokens.length !== tokens.length) return null;
        return { address, tokens, ...rest };
      }),
    );

    const tokens = await Promise.all(
      compact(skeletonsWithResolvedTokens).map(async ({ address, tokens }) => {
        const contract = multicall.wrap(this.getContract(address));

        const fragment: DataPropsStageParams<T, V>['appToken'] = {
          type: ContractType.POSITION,
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
          address,
          tokens,
        };

        // Resolve Data Props Stage
        const dataPropsStageParams = { appToken: { ...fragment }, contract, multicall };
        const dataProps = await this.getDataProps(dataPropsStageParams);

        // Resolve Display Props Stage
        const displayPropsStageParams = { appToken: { ...fragment, dataProps }, contract, multicall };
        const displayProps = {
          label: await this.getLabel(displayPropsStageParams),
          labelDetailed: await this.getLabelDetailed(displayPropsStageParams),
          secondarylabel: await this.getSecondaryLabel(displayPropsStageParams),
          tertiaryLabel: await this.getTertiaryLabel(displayPropsStageParams),
          images: await this.getImages(displayPropsStageParams),
          statsItems: await this.getStatsItems(displayPropsStageParams),
        };

        return { ...fragment, dataProps, displayProps };
      }),
    );

    return tokens;
  }

  abstract getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: {
    address: string;
    contractPosition: ContractPosition<V>;
    contract: T;
    multicall: IMulticallWrapper;
  }): Promise<BigNumberish[]>;

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
        const tokens = contractPosition.tokens.map((cp, idx) => drillBalance(cp, balancesRaw[idx]?.toString() ?? '0'));
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance: ContractPositionBalance<V> = { ...contractPosition, tokens, balanceUSD };
        return balance;
      }),
    );

    return balances;
  }
}
