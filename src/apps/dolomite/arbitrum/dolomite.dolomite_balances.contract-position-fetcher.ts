import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DolomiteContractPositionTemplatePositionFetcher } from '~apps/dolomite/arbitrum/dolomite.contract-position.template.position-fetcher';
import { GetDisplayPropsParams } from '~position/template/contract-position.template.types';

import { DolomiteContractFactory, DolomiteMargin } from '../contracts';

@PositionTemplate()
export class ArbitrumDolomiteDolomiteBalancesContractPositionFetcher extends DolomiteContractPositionTemplatePositionFetcher {
  groupLabel = 'Dolomite Balances';

  constructor(
    @Inject(APP_TOOLKIT) appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit, dolomiteContractFactory);
  }

  async getLabel(_params: GetDisplayPropsParams<DolomiteMargin>): Promise<string> {
    // we don't use a label in Dolomite Balances, since it's a group of assets
    return '';
  }

  protected isFetchingDolomiteBalances(): boolean {
    return true;
  }
}
