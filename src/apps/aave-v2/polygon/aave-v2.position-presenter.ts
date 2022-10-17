import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class PolygonAaveV2PositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf';
}
