import { Inject, Injectable } from '@nestjs/common';
import { groupBy, map, uniq } from 'lodash';

import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { PositionBalance } from '~position/position-balance.interface';
import { PositionFetcherTemplateRegistry } from '~position/position-fetcher.template-registry';
import { PositionGroup } from '~position/template/position-presenter.template';
import { Network } from '~types';

@Injectable()
export class DefaultPositionPresenterFactory {
  constructor(
    @Inject(PositionFetcherTemplateRegistry) protected positionFetcherTemplateRegistry: PositionFetcherTemplateRegistry,
  ) {}

  build({ appId, network }: { appId: string; network: Network }) {
    const klass = class DefaultPositionPresenter {
      constructor(readonly positionFetcherTemplateRegistry: PositionFetcherTemplateRegistry) {}

      getBalanceProductGroups(): PositionGroup[] {
        const templates = this.positionFetcherTemplateRegistry.getTemplatesForAppOnNetwork(appId, network);

        const groups = templates.map(template => ({
          label: template.groupLabel,
          groupIds: [template.groupId],
        }));

        const groupedByLabel = groupBy(groups, group => group.label);
        return map(groupedByLabel, (groups, label) => ({
          label,
          groupIds: uniq(groups.flatMap(({ groupIds }) => groupIds)),
        }));
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
