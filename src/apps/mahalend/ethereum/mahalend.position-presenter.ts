import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MahalendPositionPresenter } from '~apps/mahalend/common/mahalend.position-presenter';

@PresenterTemplate()
export class EthereumMahalendPositionPresenter extends MahalendPositionPresenter {
  lendingPoolAddress = '0x76F0C94Ced5B48020bf0D7f3D0CEabC877744cB5';
}
