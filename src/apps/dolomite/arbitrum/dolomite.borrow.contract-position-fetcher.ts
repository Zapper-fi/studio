import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DolomiteContractPositionTemplatePositionFetcher } from '~apps/dolomite/common/dolomite.contract-position.template.position-fetcher';

import { DolomiteViemContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumDolomiteBorrowContractPositionFetcher extends DolomiteContractPositionTemplatePositionFetcher {
  groupLabel = 'Borrow Positions';

  constructor(
    @Inject(APP_TOOLKIT) appToolkit: IAppToolkit,
    @Inject(DolomiteViemContractFactory) contractFactory: DolomiteViemContractFactory,
  ) {
    super(appToolkit, contractFactory);
  }

  protected isFetchingDolomiteBalances(): boolean {
    return false;
  }
}
