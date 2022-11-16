import { Injectable } from '@nestjs/common';

import { PresentationConfig } from '~app/app.interface';
import { PositionPresenterTemplate } from '~position/template/position-presenter.template';
import { Network } from '~types';

import EULER_DEFINITION from '../euler.definition';

@Injectable()
export class EthereumEulerPositionPresenter extends PositionPresenterTemplate {
  appId = EULER_DEFINITION.id;
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
            groupIds: ['e-token'],
          },
          {
            viewType: 'list',
            label: 'Borrow',
            groupIds: ['d-token'],
          },
        ],
      },
    ],
  };
}
