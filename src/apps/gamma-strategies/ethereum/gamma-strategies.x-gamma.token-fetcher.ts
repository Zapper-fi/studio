import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class EthereumGammaStrategiesXGammaTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'xGAMMA';
  vaultAddress = '0x26805021988f1a45dc708b5fb75fc75f21747d8c';
  underlyingTokenAddress = '0x6bea7cfef803d1e3d5f7c0103f7ded065644e197';
}
