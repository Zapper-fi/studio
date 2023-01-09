import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { Network } from '~types';

export abstract class PositionPresenterTemplate<T extends DefaultDataProps = DefaultDataProps> {
  network: Network;
  appId: string;

  positionGroups?: PositionGroup[];
  explorePresentationConfig?: PresentationConfig;

  async dataProps(_address: string): Promise<T | undefined> {
    return undefined;
  }

  // Note: This is not async on purpose. If anything needs to be async, it needs to be moved into dataProps.
  metadataItemsForBalanceGroup(
    _groupLabel: string,
    _balances: ReadonlyBalances,
    _dataProps?: T,
  ): MetadataItemWithLabel[] {
    return [];
  }
}

export type PositionGroup = { label: string; groupIds: string[] };
export type ReadonlyBalances = ReadonlyArray<Readonly<Balance>>;
export type GroupMeta = MetadataItemWithLabel[];
export type Balance = TokenBalance | ContractPositionBalance;
