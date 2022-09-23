import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class ArbitrumPlutusPlsDpxTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'plsDPX';

  vaultAddress = '0xf236ea74b515ef96a9898f5a4ed4aa591f253ce1';
  underlyingTokenAddress = '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55';
}
