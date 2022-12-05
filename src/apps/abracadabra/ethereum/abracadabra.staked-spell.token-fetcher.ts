import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class EthereumAbracadabraStakedSpellTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'Staked SPELL';

  vaultAddress = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
  underlyingTokenAddress = '0x090185f2135308bad17527004364ebcc2d37e5f6';
}
