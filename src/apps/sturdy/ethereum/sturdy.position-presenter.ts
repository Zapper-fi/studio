import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class EthereumSturdyPositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0xa422ca380bd70eef876292839222159e41aaee17';
}
