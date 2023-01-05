import { PresentationConfig } from '~app/app.interface';
import { MetadataItemWithLabel } from '~balance/balance-fetcher.interface';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { Network } from '~types';

export type PositionDataPropsParams = {
  address: string;
  groupLabel: string;
  balances: ReadonlyBalances;
};

export abstract class PositionPresenterTemplate<T extends DefaultDataProps = DefaultDataProps> {
  network: Network;
  appId: string;

  positionGroups?: PositionGroup[];
  explorePresentationConfig?: PresentationConfig;

  async positionDataProps(_opts: PositionDataPropsParams): Promise<T | undefined> {
    return undefined;
  }

  // NOTE: This method is not async on purpose since it is called inline when rendering each positions.
  presentDataProps(_dataProps: T): MetadataItemWithLabel[] {
    return [];
  }
}

export type PositionGroup = { label: string; groupIds: string[] };
export type ReadonlyBalances = ReadonlyArray<Readonly<Balance>>;
export type GroupMeta = MetadataItemWithLabel[];
export type Balance = TokenBalance | ContractPositionBalance;
