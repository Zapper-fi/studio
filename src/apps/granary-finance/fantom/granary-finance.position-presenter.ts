import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class FantomGranaryFinancePositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x7220ffd5dc173ba3717e47033a01d870f06e5284';
}
