import { Network } from '~types';

export abstract class PositionPresenterTemplate {
  abstract network: Network;
  abstract appId: string;

  positionGroups?: Record<string, string[]>;
}
