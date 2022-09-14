import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { Network } from '~types';

export interface PositionPresenter {
  explorePresentationConfig?: PresentationConfig;
}

export abstract class PositionPresenterTemplate implements PositionPresenter {
  abstract network: Network;
  abstract appId: string;

  positionGroups?: PositionGroup[];
  explorePresentationConfig?: PresentationConfig;
}

export type PositionGroup = { label: string; groupIds: string[] };
export type ReadonlyBalances = ReadonlyArray<Readonly<Balance>>;
export type GroupMeta = MetadataItemWithLabel[];
export type Balance = TokenBalance | ContractPositionBalance;
