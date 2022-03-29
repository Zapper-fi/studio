import { DefaultDataProps } from './display.interface';
import { AbstractPosition } from './position.interface';

export interface PositionFetcher<T extends AbstractPosition<V>, V = DefaultDataProps> {
  getPositions(): Promise<T[]>;
}
