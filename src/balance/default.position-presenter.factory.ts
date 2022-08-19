import { Inject, Injectable } from '@nestjs/common';

import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { PositionBalance } from '~position/position-balance.interface';
import { PositionFetcherTemplateRegistry } from '~position/position-fetcher.template-registry';
import { PositionGroup, PositionPresenter } from '~position/template/position-presenter.template';
import { Network } from '~types';

@Injectable()
export class DefaultPositionPresenterFactory {
  constructor(
    @Inject(PositionFetcherTemplateRegistry) protected positionFetcherTemplateRegistry: PositionFetcherTemplateRegistry,
  ) {}

  build({ appId, network }: { appId: string; network: Network }) {
    const klass = class DefaultPositionPresenter implements PositionPresenter {
      constructor(readonly positionFetcherTemplateRegistry: PositionFetcherTemplateRegistry) {}

      buildDefaultPositionGroupsGroups() {
        const templates = this.positionFetcherTemplateRegistry.getTemplatesForApp(appId, network);

        return templates.map(template => ({
          selector: template.groupId,
          label: template.groupLabel ?? '',
          groupIds: [template.groupId],
        }));
      }

      getExplorePresentation() {
        return null;
      }

      getBalanceProductGroups() {
        return this.buildDefaultPositionGroupsGroups();
      }

      async presentBalances(balances: PositionBalance[], _positionGroups?: PositionGroup[]) {
        const positionGroups = _positionGroups ?? this.getBalanceProductGroups();

        const products = positionGroups.map(group => {
          const groupBalances = balances.filter(v => group.groupIds.includes(v.groupId));
          return { label: group.label, assets: groupBalances };
        });

        return presentBalanceFetcherResponse(products);
      }
    };

    return new klass(this.positionFetcherTemplateRegistry);
  }
}
