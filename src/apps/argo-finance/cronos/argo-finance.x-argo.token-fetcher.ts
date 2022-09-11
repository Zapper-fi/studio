import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { ARGO_FINANCE_DEFINITION } from '../argo-finance.definition';
import { ArgoFinanceXargoTokenFetcher } from '../common/argo-finance.x-argo.token-fetcher';

@Injectable()
export class CronosArgoFinanceXArgoTokenFetcher extends ArgoFinanceXargoTokenFetcher {
  appId = ARGO_FINANCE_DEFINITION.id;
  groupId = ARGO_FINANCE_DEFINITION.groups.xArgo.id;
  network = Network.CRONOS_MAINNET;
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
