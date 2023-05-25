import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class ArbitrumGranaryFinancePositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0x102442a3ba1e441043154bc0b8a2e2fb5e0f94a7';
}
