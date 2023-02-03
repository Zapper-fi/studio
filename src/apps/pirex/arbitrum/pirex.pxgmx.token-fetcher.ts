import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class ArbitrumPirexPxGmxTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'Pirex GMX';
  vaultAddress = '0x9a592b4539e22eeb8b2a3df679d572c7712ef999';
  underlyingTokenAddress = '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a';
}
