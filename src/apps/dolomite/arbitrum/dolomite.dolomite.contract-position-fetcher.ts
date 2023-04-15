import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DolomiteContractPositionTemplatePositionFetcher } from '~apps/dolomite/common/dolomite.contract-position.template.position-fetcher';

import { DolomiteContractFactory } from '../contracts';

@PositionTemplate()
export class ArbitrumDolomiteDolomiteContractPositionFetcher extends DolomiteContractPositionTemplatePositionFetcher {
  groupLabel = 'Dolomite Balances';

  constructor(
    @Inject(APP_TOOLKIT) appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit, dolomiteContractFactory);
  }

  protected isFetchingDolomiteBalances(): boolean {
    return true;
  }
}
