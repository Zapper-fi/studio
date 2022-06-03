import { DefaultDataProps } from './display.interface';
import { PositionBalance } from './position-balance.interface';

export interface PositionBalanceFetcher<T extends PositionBalance<V>, V = DefaultDataProps> {
  getBalances(address: string): Promise<T[]>;
}
