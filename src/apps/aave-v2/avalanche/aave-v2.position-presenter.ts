import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class AvalancheAaveV2PositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x4f01aed16d97e3ab5ab2b501154dc9bb0f1a5a2c';
}
