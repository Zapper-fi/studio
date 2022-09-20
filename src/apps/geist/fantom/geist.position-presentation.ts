import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class FantomGeistPositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x9fad24f572045c7869117160a571b2e50b10d068';
}
