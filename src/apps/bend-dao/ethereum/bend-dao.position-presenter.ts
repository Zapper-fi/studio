import { Injectable } from '@nestjs/common';

import { PresentationConfig } from '~app/app.interface';
import { PositionPresenterTemplate } from '~position/template/position-presenter.template';
import { Network } from '~types';

import { BEND_DAO_DEFINITION } from '../bend-dao.definition';

@Injectable()
export class EthereumBendDaoPositionPresenter extends PositionPresenterTemplate {
  appId = BEND_DAO_DEFINITION.id;
  network = Network.ETHEREUM_MAINNET;

  explorePresentationConfig?: PresentationConfig = {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Supply',
            groupIds: ['supply'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['borrow'],
          },
        ],
      },
    ],
  };
}
