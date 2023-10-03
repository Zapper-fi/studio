import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class ArbitrumMahalendPositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x88c6a98430Cc833E168430DaC427e9796C9EC576';
}
