import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { MahalendPositionPresenter } from '~apps/mahalend/common/mahalend.position-presenter';

@PresenterTemplate()
export class ArbitrumMahalendPositionPresenter extends MahalendPositionPresenter {
  lendingPoolAddress = '0x88c6a98430Cc833E168430DaC427e9796C9EC576';
}
