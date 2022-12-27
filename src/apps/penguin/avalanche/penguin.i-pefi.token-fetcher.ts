import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class AvalanchePenguinIPefiTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'iPEFI';

  vaultAddress = '0xe9476e16fe488b90ada9ab5c7c2ada81014ba9ee';
  underlyingTokenAddress = '0xe896cdeaac9615145c0ca09c8cd5c25bced6384c';
}
