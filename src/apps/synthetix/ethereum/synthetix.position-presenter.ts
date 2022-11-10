import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';

import { SynthetixPositionPresenter } from '../common/synthetix.position-presenter';

@PresenterTemplate()
export class EthereumSynthetixPositionPresenter extends SynthetixPositionPresenter {
  snxAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';
}
