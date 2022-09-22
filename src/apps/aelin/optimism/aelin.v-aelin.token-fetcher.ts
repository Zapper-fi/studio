import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class OptimismAelinVAelinTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'vAELIN';

  vaultAddress = '0x780f70882ff4929d1a658a4e8ec8d4316b24748a';
  underlyingTokenAddress = '0x61baadcf22d2565b0f471b291c475db5555e0b76';
}
