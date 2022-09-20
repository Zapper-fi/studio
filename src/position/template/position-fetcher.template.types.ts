import { Network } from '~types';

export interface PositionFetcherTemplateCommons {
  appId: string;
  groupId: string;
  network: Network;
  groupLabel: string;

  isExcludedFromBalances: boolean;
  isExcludedFromTvl: boolean;
  isExcludedFromExplore: boolean;
}
