import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class AvalancheNereusFinancePositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0xb9257597eddfa0ecaff04ff216939fbc31aac026';
}
