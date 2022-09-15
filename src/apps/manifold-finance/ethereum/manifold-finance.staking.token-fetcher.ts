import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class EthereumManifoldFinanceStakingTokenFetcher extends VaultTokenFetcher {
  groupLabel = 'xFOLD';

  vaultAddress = '0x454bd9e2b29eb5963048cc1a8bd6fd44e89899cb';
  underlyingTokenAddress = '0xd084944d3c05cd115c09d072b9f44ba3e0e45921';

  async getPricePerShare() {
    return 1;
  }
}
