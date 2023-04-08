import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DolomiteContractPositionTemplatePositionFetcher } from '~apps/dolomite/arbitrum/dolomite.contract-position.template.position-fetcher';
import { DolomiteContractPosition, DolomiteContractPositionDefinition, DolomiteDataProps } from '~apps/dolomite/utils';
import { GetDisplayPropsParams } from '~position/template/contract-position.template.types';

import { DolomiteContractFactory, DolomiteMargin } from '../contracts';

@PositionTemplate()
export class ArbitrumDolomiteBorrowPositionsContractPositionFetcher extends DolomiteContractPositionTemplatePositionFetcher {
  groupLabel = 'Borrow Positions';

  constructor(
    @Inject(APP_TOOLKIT) appToolkit: IAppToolkit,
    @Inject(DolomiteContractFactory) dolomiteContractFactory: DolomiteContractFactory,
  ) {
    super(appToolkit, dolomiteContractFactory);
  }

  async getLabel(
    params: GetDisplayPropsParams<DolomiteMargin, DolomiteDataProps, DolomiteContractPositionDefinition>,
  ): Promise<string> {
    // The label is determined based on the unique account struct that is associated with the position
    const castedPosition = params.contractPosition as DolomiteContractPosition;
    if (castedPosition.accountStructs && castedPosition.accountStructs.length === 1) {
      const account = castedPosition.accountStructs[0];
      return `${account.accountOwner}-${account.accountNumber}}`;
    }

    return '';
  }

  protected isFetchingDolomiteBalances(): boolean {
    return false;
  }
}
