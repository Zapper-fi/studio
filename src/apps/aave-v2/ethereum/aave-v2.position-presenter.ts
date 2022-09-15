import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class EthereumAaveV2PositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9';
}
