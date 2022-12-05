import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';
import { AaveV2PositionPresenter } from '~apps/aave-v2/common/aave-v2.position-presenter';

@PresenterTemplate()
export class EthereumGranaryFinancePositionPresenter extends AaveV2PositionPresenter {
  lendingPoolAddress = '0xb702ce183b4e1faa574834715e5d4a6378d0eed3';
}
