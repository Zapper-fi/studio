import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { Network } from '~types';

export interface PositionPresenter {
  excludedGroupIdsFromBalances: string[];
  explorePresentationConfig?: PresentationConfig;
}

export abstract class PositionPresenterTemplate implements PositionPresenter {
  constructor(
    @Inject(APP_TOOLKIT)
    protected readonly appToolkit: IAppToolkit,
  ) {}

  abstract network: Network;
  abstract appId: string;

  positionGroups?: PositionGroup[];
  excludedGroupIdsFromBalances: string[] = [];
  explorePresentationConfig?: PresentationConfig;
}

export type PositionGroup = { label: string; groupIds: string[] };
export type ReadonlyBalances = ReadonlyArray<Readonly<Balance>>;
export type GroupMeta = MetadataItemWithLabel[];
export type Balance = TokenBalance | ContractPositionBalance;
