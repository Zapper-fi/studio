import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { ArgoFinanceXargoTokenFetcher } from '../common/argo-finance.x-argo.token-fetcher';

@PositionTemplate()
export class CronosArgoFinanceXArgoTokenFetcher extends ArgoFinanceXargoTokenFetcher {
  groupLabel = 'XArgo';

  isExcludedFromBalances = true;
  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  async getAddresses(): Promise<string[]> {
    return ['0xb966b5d6a0fcd5b373b180bbe072bbfbbee10552'];
  }

  async getUnderlyingTokenAddresses(): Promise<string> {
    return '0x47a9d630dc5b28f75d3af3be3aaa982512cd89aa';
  }
}
