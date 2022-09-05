import { Injectable } from '@nestjs/common';

import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';
import { Network } from '~types/network.interface';

import { MANIFOLD_FINANCE_DEFINITION } from '../manifold-finance.definition';

@Injectable()
export class EthereumManifoldFinanceStakingTokenFetcher extends VaultTokenFetcher {
  appId = MANIFOLD_FINANCE_DEFINITION.id;
  groupId = MANIFOLD_FINANCE_DEFINITION.groups.staking.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'xFOLD';

  vaultAddress = '0x454bd9e2b29eb5963048cc1a8bd6fd44e89899cb';
  underlyingTokenAddress = '0xd084944d3c05cd115c09d072b9f44ba3e0e45921';

  async getPricePerShare() {
    return 1;
  }
}
