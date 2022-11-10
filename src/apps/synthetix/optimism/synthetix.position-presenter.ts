import { PresenterTemplate } from '~app-toolkit/decorators/presenter-template.decorator';

import { SynthetixPositionPresenter } from '../common/synthetix.position-presenter';

@PresenterTemplate()
export class OptimismSynthetixPositionPresenter extends SynthetixPositionPresenter {
  snxAddress = '0x8700daec35af8ff88c16bdf0418774cb3d7599b4';
}
