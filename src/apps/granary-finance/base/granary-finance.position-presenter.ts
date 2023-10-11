import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { PresentationConfig } from '~app/app.interface';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class BaseGranaryFinancePositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0xb702ce183b4e1faa574834715e5d4a6378d0eed3';

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
            groupIds: ['variable-debt'],
          },
        ],
      },
    ],
  };
}
