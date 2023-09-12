import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';

import { SynthetixPositionPresenter } from '../common/synthetix.position-presenter';

@PresenterTemplate()
export class EthereumSynthetixPositionPresenter extends SynthetixPositionPresenter {
  snxAddress = '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f';
  sUSDAddress = '0x57ab1ec28d129707052df4df418d58a2d46d5f51';
}
