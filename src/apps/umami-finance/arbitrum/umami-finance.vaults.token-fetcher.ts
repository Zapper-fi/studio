import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class ArbitrumUmamiFinanceVaultsTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'Vaults';

  vaultAddress = '0x2e2153fd13459eba1f277ab9acd624f045d676ce';
  underlyingTokenAddress = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
}
