import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class EthereumMahalendPositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x76F0C94Ced5B48020bf0D7f3D0CEabC877744cB5';
}
