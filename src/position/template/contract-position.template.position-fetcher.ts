import { Inject } from '@nestjs/common';
import { Contract } from 'ethers/lib/ethers';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import {
  buildDollarDisplayItem,
  buildPercentageDisplayItem,
} from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps, DisplayProps, StatsItem } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { metatyped } from '~position/position.utils';
import { Network } from '~types/network.interface';

export type DefaultContractPositionDescriptor = {
  address: string;
};

export type UnderlyingTokenDescriptor = {
  address: string;
  metaType: MetaType;
};

export type StageParams<T extends Contract, V, K extends keyof ContractPosition> = {
  multicall: IMulticallWrapper;
  contract: T;
  appToken: Omit<ContractPosition<V>, K>;
};

export type TokensStageParams<
  T extends Contract,
  R extends DefaultContractPositionDescriptor = DefaultContractPositionDescriptor,
> = {
  contract: T;
  descriptor: R;
};
export type DataPropsStageParams<T extends Contract, V = DefaultDataProps> = StageParams<
  T,
  V,
  'dataProps' | 'displayProps'
>;
export type DisplayPropsStageParams<T extends Contract, V = DefaultDataProps> = StageParams<T, V, 'displayProps'>;

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
  async getTokenDescriptors(_params: TokensStageParams<T, R>): Promise<UnderlyingTokenDescriptor[]> {
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
    const tokenLoader = this.appToolkit.getBaseTokenPriceSelector({
      tags: { network: this.network, appId: `${this.appId}__template` },
    });
    const appTokenLoader = this.appToolkit.getAppTokenSelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });

    const descriptors = await this.getDescriptors();
    const skeletons = await Promise.all(
      descriptors.map(async descriptor => {
        const contract = multicall.wrap(this.getContract(descriptor.address));
        const tokenDescriptors = await this.getTokenDescriptors({ contract, descriptor })
          .then(v => (Array.isArray(v) ? v : [v]))
          .then(v => v.map(t => ({ ...t, address: t.address.toLowerCase() })));

        return { ...descriptor, tokenDescriptors };
      }),
    );

    const underlyingTokenRequests = skeletons
      .flatMap(v => v.tokenDescriptors.map(v => v.address))
      .map(v => ({ network: this.network, address: v }));
    const baseTokens = await tokenLoader.getMany(underlyingTokenRequests);
    const appTokens = await appTokenLoader.getMany(underlyingTokenRequests);
    const allTokens = [...compact(appTokens), ...compact(baseTokens)];

    const skeletonsWithResolvedTokens = await Promise.all(
      skeletons.map(async ({ address, tokenDescriptors, ...rest }) => {
        const maybeTokens = tokenDescriptors.map(v => {
          const match = allTokens.find(t => t.address === v.address);
          return match ? metatyped(match, v.metaType) : null;
        });

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
}
