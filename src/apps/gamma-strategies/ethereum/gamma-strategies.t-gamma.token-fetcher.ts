import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class EthereumGammaStrategiesTGammaTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'tGAMMA';
  vaultAddress = '0x2fc6e9c1b2c07e18632efe51879415a580ad22e1';
  underlyingTokenAddress = '0x6bea7cfef803d1e3d5f7c0103f7ded065644e197';
}
