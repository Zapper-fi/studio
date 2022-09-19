import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class FantomHectorNetworkWsHecTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'Wrapped sHEC V2';

  vaultAddress = '0x94ccf60f700146bea8ef7832820800e2dfa92eda';
  underlyingTokenAddress = '0x75bdef24285013387a47775828bec90b91ca9a5f';
}
