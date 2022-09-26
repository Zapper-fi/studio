import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class FantomSturdyPositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x7ff2520cd7b76e8c49b5db51505b842d665f3e9a';
}
