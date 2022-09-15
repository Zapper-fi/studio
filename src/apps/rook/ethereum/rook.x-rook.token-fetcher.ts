import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { VaultTemplateTokenFetcher } from '~position/template/vault.template.token-fetcher';

@PositionTemplate()
export class EthereumRookXRookTokenFetcher extends VaultTemplateTokenFetcher {
  groupLabel = 'xROOK';

  vaultAddress = '0x8ac32f0a635a0896a8428a9c31fbf1ab06ecf489';
  underlyingTokenAddress = '0xfa5047c9c78b8877af97bdcb85db743fd7313d4a';
  reserveAddress = '0x4f868c1aa37fcf307ab38d215382e88fca6275e2';
}
