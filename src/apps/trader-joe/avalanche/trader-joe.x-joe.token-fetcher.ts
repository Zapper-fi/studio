import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class AvalancheTraderJoeXJoeTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'xJOE';

  vaultAddress = '0x57319d41f71e81f3c65f2a47ca4e001ebafd4f33';
  underlyingTokenAddress = '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd';
}
