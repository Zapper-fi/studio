import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class OptimismGranaryFinancePositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x8fd4af47e4e63d1d2d45582c3286b4bd9bb95dfe';
}
