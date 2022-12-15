import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class EthereumMapleXMplTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'xMPL';

  vaultAddress = '0x4937a209d4cdbd3ecd48857277cfd4da4d82914c';
  underlyingTokenAddress = '0x33349b282065b0284d756f0577fb39c158f935e6';
}
