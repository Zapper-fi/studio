import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class AvalanchePenguinXPefiTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'xPEFI';

  vaultAddress = '0xd79a36056c271b988c5f1953e664e61416a9820f';
  underlyingTokenAddress = '0xe896cdeaac9615145c0ca09c8cd5c25bced6384c';
}
