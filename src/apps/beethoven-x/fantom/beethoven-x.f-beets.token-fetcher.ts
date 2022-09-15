import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class FantomBeethovenXFBeetsTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'Staking';

  vaultAddress = '0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1';
  underlyingTokenAddress = '0xcde5a11a4acb4ee4c805352cec57e236bdbc3837';
}
