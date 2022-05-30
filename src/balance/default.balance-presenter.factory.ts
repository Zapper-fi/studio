import { Inject, Injectable } from '@nestjs/common';
import { groupBy, values } from 'lodash';

import { presentBalanceFetcherResponse } from '~app-toolkit/helpers/presentation/balance-fetcher-response.present';
import { AppService } from '~app/app.service';
import { PositionBalance } from '~position/position-balance.interface';
import { Network } from '~types';

import { BalancePresenter } from './balance-presenter.interface';

type BuildBalancePresenterParams = {
  appId: string;
  network: Network;
};

@Injectable()
export class DefaultBalancePresenterFactory {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  build({ appId }: BuildBalancePresenterParams) {
    const klass = class DefaultBalancePresenter implements BalancePresenter {
      constructor(readonly appService: AppService) {}

      async present(balances: PositionBalance[]) {
        // Build labelled groups by the labels defined in the app definition
        const app = this.appService.getApp(appId);
        const products = Object.values(app.groups).map(group => {
          const groupBalances = balances.filter(v => v.groupId === group.id);
          return { label: group.label, assets: groupBalances };
        });

        // Collapse products on colliding group labels
        const collapsedProducts = values(groupBy(products, v => v.label)).map(t => ({
          label: t[0].label,
          assets: t.flatMap(v => v.assets),
        }));

        return presentBalanceFetcherResponse(collapsedProducts);
      }
    };

    const instance = new klass(this.appService);
    return instance;
  }
}
