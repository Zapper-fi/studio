import { Inject, Injectable } from '@nestjs/common';
import _, { get, groupBy } from 'lodash';

import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AppService } from '~app/app.service';
import { DefaultDataProps } from '~position/display.interface';
import {
  AppTokenPositionBalance,
  ContractPositionBalance,
  PositionBalance,
} from '~position/position-balance.interface';
import { PositionFetcherTemplateRegistry } from '~position/position-fetcher.template-registry';
import { PositionPresenterRegistry } from '~position/position-presenter.registry';
import { PositionGroup } from '~position/template/position-presenter.template';
import { Network } from '~types';

import { TokenBalanceResponse } from './balance-fetcher.interface';

type Balances = (AppTokenPositionBalance | ContractPositionBalance)[];

@Injectable()
export class BalancePresentationService {
  constructor(
    @Inject(PositionPresenterRegistry) private readonly positionPresenterRegistry: PositionPresenterRegistry,
    @Inject(PositionFetcherTemplateRegistry)
    private readonly positionFetcherTemplateRegistry: PositionFetcherTemplateRegistry,
    @Inject(AppService) private readonly appService: AppService,
  ) {}

  private groupBalancesByPositionGroup(
    balances: (AppTokenPositionBalance | ContractPositionBalance)[],
    positionGroup: PositionGroup,
  ) {
    const getDynamicLabel = (label: string) => {
      const matches = label.match(/{{(.*)}}/);
      if (!matches) return null;
      return matches[1].trim();
    };

    const dynamicLabel = getDynamicLabel(positionGroup.label);
    if (!dynamicLabel)
      return { [positionGroup.label]: balances.filter(({ groupId }) => positionGroup.groupIds.includes(groupId)) };
    else {
      return groupBy(balances, balance => get(balance, dynamicLabel));
    }
  }

  async presentTemplates({
    appId,
    network,
    balances,
    dataProps,
  }: {
    appId: string;
    balances: Balances;
    network: Network;
    dataProps?: DefaultDataProps;
  }): Promise<TokenBalanceResponse> {
    return this.presentBalances(appId, network, balances, dataProps);
  }

  async present({ appId, balances }: { appId: string; balances: Balances }): Promise<TokenBalanceResponse> {
    // Build labelled groups by the labels defined in the app definition
    const app = await this.appService.getApp(appId);
    const products = Object.values(app!.groups ?? {}).map(group => {
      const groupBalances = balances.filter(v => v.groupId === group.id);
      return { label: group.label, assets: groupBalances };
    });

    // Collapse products on colliding group labels
    const collapsedProducts = _.values(groupBy(products, v => v.label)).map(t => ({
      label: t[0].label,
      assets: t.flatMap(v => v.assets),
    }));

    return presentBalanceFetcherResponse(collapsedProducts);
  }

  private getBalanceProductGroups(appId: string, network: Network): PositionGroup[] {
    const templates = this.positionFetcherTemplateRegistry.getTemplatesForAppOnNetwork(appId, network);

    const groups = templates
      .filter(template => !template.isExcludedFromBalances)
      .map(template => ({
        label: template.groupLabel,
        groupIds: [template.groupId],
      }));

    const groupedByLabel = groupBy(groups, group => group.label);
    return _.map(groupedByLabel, (groups, label) => ({
      label,
      groupIds: _.uniq(groups.flatMap(({ groupIds }) => groupIds)),
    }));
  }

  async balanceDataProps({ appId, network, address }: { appId: string; network: Network; address: string }) {
    const presenter = this.positionPresenterRegistry.get(appId, network);
    if (!presenter) return;

    const dataProps = await presenter.dataProps(address);
    return dataProps;
  }

  private groupBalances(
    appId: string,
    network: Network,
    balances: PositionBalance[],
  ): { [groupLabel: string]: PositionBalance[] } {
    const presenter = this.positionPresenterRegistry.get(appId, network);
    const positionGroups = presenter?.positionGroups ?? this.getBalanceProductGroups(appId, network);

    return positionGroups
      .map(group => this.groupBalancesByPositionGroup(balances, group))
      .reduce((acc, v) => {
        Object.entries(v).forEach(([groupLabel, balances]) => {
          acc[groupLabel] = (acc[groupLabel] || []).concat(balances);
        });
        return acc;
      }, {});
  }

  private presentBalances(appId: string, network: Network, balances: PositionBalance[], dataProps?: DefaultDataProps) {
    const balancesByGroupLabel = this.groupBalances(appId, network, balances);
    const presenter = this.positionPresenterRegistry.get(appId, network);

    const products = _(balancesByGroupLabel)
      .mapValues((assets, label) => {
        // Ignore groups with no assets/balances
        if (!assets.length) return;

        const meta = presenter && presenter.metadataItemsForBalanceGroup(label, assets, dataProps);

        return {
          label,
          assets,
          ...(meta && { meta }),
        };
      })
      .values()
      .compact()
      .value();

    return presentBalanceFetcherResponse(products);
  }
}
