import { Inject, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { get, groupBy } from 'lodash';

import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AppService } from '~app/app.service';
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

export type PresentParams = {
  appId: string;
  network: Network;
  address: string;
  balances: (AppTokenPositionBalance | ContractPositionBalance)[];
};

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

  async present({ appId, balances }: PresentParams): Promise<TokenBalanceResponse> {
    return this.present2(appId, balances);
  }

  async presentTemplates({ address, appId, network, balances }: PresentParams): Promise<TokenBalanceResponse> {
    return this.presentBalances(address, appId, network, balances);
  }

  private async present2(appId: string, balances: PositionBalance[]) {
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

  private async presentBalances(address: string, appId: string, network: Network, balances: PositionBalance[]) {
    const customPresenter = this.positionPresenterRegistry.get(appId, network);
    const positionGroups = customPresenter?.positionGroups ?? this.getBalanceProductGroups(appId, network);

    const balanceMetaResolvers = this.positionPresenterRegistry.getBalanceProductMetaResolvers(appId, network);
    const products = await Promise.all(
      positionGroups.map(async group => {
        const groupBalances = this.groupBalancesByPositionGroup(balances, group);

        return Promise.all(
          Object.entries(groupBalances).map(async ([computedGroupLabel, balances]) => {
            const groupMetaResolver = balanceMetaResolvers?.get(group.label);

            return {
              label: computedGroupLabel,
              assets: balances,
              ...(groupMetaResolver && { meta: await groupMetaResolver(address, balances) }),
            };
          }),
        );
      }),
    );

    return presentBalanceFetcherResponse(products.flat());
  }
}
