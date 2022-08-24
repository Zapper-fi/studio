import { Injectable } from '@nestjs/common';

import { PresentationConfig } from '~app/app.interface';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';
import { Network } from '~types';

import AGAVE_DEFINITION from '../agave.definition';

@Injectable()
export class GnosisAgavePositionPresenter extends AaveV2PositionPresenter {
  appId = AGAVE_DEFINITION.id;
  network = Network.GNOSIS_MAINNET;
  lendingPoolAddress = '0x5e15d5e33d318dced84bfe3f4eace07909be6d9c';

  explorePresentationConfig: PresentationConfig = {
    tabs: [
      {
        label: 'Lending',
        viewType: 'split',
        views: [
          {
            viewType: 'list',
            label: 'Deposit',
            groupIds: ['deposit'],
          },
          {
            viewType: 'split',
            label: 'Borrow',
            views: [
              {
                viewType: 'list',
                label: 'Variable',
                groupIds: ['variable-borrow'],
              },
              {
                viewType: 'list',
                label: 'Stable',
                groupIds: ['stable-borrow'],
              },
            ],
          },
        ],
      },
    ],
  };
}
